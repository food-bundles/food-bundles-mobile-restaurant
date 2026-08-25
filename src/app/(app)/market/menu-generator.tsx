import { useState } from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenScroll, ScreenHeader, StickyFooter } from '@/components/layout';
import { MultiSelectChips } from './_components/MultiSelectChips';
import { PortionStepper } from './_components/PortionStepper';
import { MarketContextCard } from './_components/MarketContextCard';
import { TrendingChipsRow } from './_components/TrendingChipsRow';
import { MenuTabSwitch, type MenuTab } from './_components/MenuTabSwitch';
import { MenuDishCard } from './_components/MenuDishCard';
import { IngredientListRow } from './_components/IngredientListRow';
import { useCartStore } from '@/stores';
import { consolidateIngredients, formatDate } from '@/lib';
import { getDishesForMenu, account } from '@/mocks';
import type { CuisineType, MealType, MenuDish } from '@/mocks/types';
import { useT } from '@/i18n';
import type { TranslationKey } from '@/i18n';

const CUISINE_OPTIONS: CuisineType[] = ['AFRICAN', 'INDIAN', 'WESTERN', 'ASIAN', 'MEDITERRANEAN', 'FUSION'];
const MEAL_OPTIONS: MealType[] = ['BREAKFAST', 'LUNCH', 'DINNER', 'ALL_DAY'];
const DEFAULT_PORTIONS = 50;
const GENERATED_DATE_ISO = '2026-08-25';

const CUISINE_LABEL: Record<CuisineType, TranslationKey> = {
  AFRICAN: 'menu_cuisineAfrican',
  INDIAN: 'menu_cuisineIndian',
  WESTERN: 'menu_cuisineWestern',
  ASIAN: 'menu_cuisineAsian',
  MEDITERRANEAN: 'menu_cuisineMediterranean',
  FUSION: 'menu_cuisineFusion',
};

const MEAL_LABEL: Record<MealType, TranslationKey> = {
  BREAKFAST: 'menu_mealBreakfast',
  LUNCH: 'menu_mealLunch',
  DINNER: 'menu_mealDinner',
  ALL_DAY: 'menu_mealAllDay',
};

/** Two-step flow: pick cuisine/meal types + covers, then a generated menu with cart integration. */
export default function MenuGenerator() {
  const t = useT();
  const { colors } = useTheme();
  const addQty = useCartStore((state) => state.addQty);
  const [cuisines, setCuisines] = useState<CuisineType[]>([]);
  const [mealTypes, setMealTypes] = useState<MealType[]>([]);
  const [portions, setPortions] = useState(DEFAULT_PORTIONS);
  const [generated, setGenerated] = useState(false);
  const [tab, setTab] = useState<MenuTab>('byMeal');

  const toggleCuisine = (cuisine: CuisineType) => {
    setCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]));
  };
  const toggleMeal = (meal: MealType) => {
    setMealTypes((prev) => (prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]));
  };

  const dishes: MenuDish[] = cuisines.flatMap((cuisine) => getDishesForMenu(cuisine, mealTypes));
  const consolidated = consolidateIngredients(dishes);

  const onAddDishIngredients = (dish: MenuDish, productIds: string[], quantities: Record<string, number>) => {
    for (const productId of productIds) {
      const ingredient = dish.ingredients.find((i) => i.productId === productId);
      if (ingredient) addQty(productId, quantities[productId] ?? ingredient.qty);
    }
  };

  const onOrderAllFromFoodBundles = () => {
    for (const ingredient of consolidated) addQty(ingredient.productId, ingredient.qty);
  };

  const onExportPdf = () => {
    Share.share({ message: t('menu_exportShareMessage', { restaurant: account.businessName }) });
  };

  if (!generated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.oat }]}>
        <ScreenHeader title={t('menu_step1Title')} />
        <ScreenScroll contentInsetBottom={100}>
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('menu_cuisineStyle')}</Text>
          <MultiSelectChips
            options={CUISINE_OPTIONS.map((cuisine) => ({ key: cuisine, label: t(CUISINE_LABEL[cuisine]) }))}
            selected={cuisines}
            onToggle={toggleCuisine}
          />
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('menu_mealTypesToInclude')}</Text>
          <MultiSelectChips
            options={MEAL_OPTIONS.map((meal) => ({ key: meal, label: t(MEAL_LABEL[meal]) }))}
            selected={mealTypes}
            onToggle={toggleMeal}
          />
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('menu_coversPerService')}</Text>
          <PortionStepper value={portions} onChange={setPortions} />
          <View style={styles.contextGap}>
            <MarketContextCard />
          </View>
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('menu_trendingTitle')}</Text>
          <TrendingChipsRow />
        </ScreenScroll>
        <StickyFooter>
          <Pressable
            onPress={() => setGenerated(true)}
            disabled={cuisines.length === 0 || mealTypes.length === 0}
            accessibilityRole="button"
            accessibilityLabel={t('menu_generateCta')}
            style={[
              styles.primaryButton,
              { backgroundColor: colors.leaf },
              (cuisines.length === 0 || mealTypes.length === 0) && styles.disabled,
            ]}
          >
            <Text style={[styles.primaryLabel, { color: colors.paper }]}>{t('menu_generateCta')} →</Text>
          </Pressable>
        </StickyFooter>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={t('menu_outputTitle', { restaurant: account.businessName })} />
      <ScreenScroll contentInsetBottom={140}>
        <Text style={[styles.subtitle, { color: colors.secondary }]}>
          {t('menu_outputSubtitle', { date: formatDate(GENERATED_DATE_ISO) })}
        </Text>
        <View style={styles.tabGap}>
          <MenuTabSwitch active={tab} onSelect={setTab} />
        </View>
        <View style={styles.listGap}>
          {tab === 'byMeal'
            ? dishes.map((dish) => (
                <MenuDishCard key={dish.id} dish={dish} onAddIngredients={onAddDishIngredients} />
              ))
            : consolidated.map((ingredient) => (
                <IngredientListRow key={ingredient.productId} ingredient={ingredient} />
              ))}
        </View>
      </ScreenScroll>
      <StickyFooter>
        <Pressable
          onPress={onOrderAllFromFoodBundles}
          accessibilityRole="button"
          accessibilityLabel={t('menu_orderAllFromFoodBundles')}
          style={[styles.primaryButton, { backgroundColor: colors.leaf }]}
        >
          <Text style={[styles.primaryLabel, { color: colors.paper }]}>{t('menu_orderAllFromFoodBundles')}</Text>
        </Pressable>
        <Pressable
          onPress={onExportPdf}
          accessibilityRole="button"
          accessibilityLabel={t('menu_exportPdf')}
          style={[styles.secondaryButton, { borderColor: colors.leaf }]}
        >
          <Text style={[styles.secondaryLabel, { color: colors.leaf }]}>{t('menu_exportPdf')}</Text>
        </Pressable>
      </StickyFooter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionLabel: { ...text.overline, marginTop: space.lg, marginBottom: space.sm },
  contextGap: { marginTop: space.lg },
  subtitle: { ...text.caption, marginTop: space.sm },
  tabGap: { marginTop: space.md },
  listGap: { marginTop: space.md },
  primaryButton: { minHeight: hit.min, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { ...text.bodySemi },
  secondaryButton: {
    minHeight: hit.min,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.sm,
  },
  secondaryLabel: { ...text.bodySemi },
  disabled: { opacity: 0.5 },
});
