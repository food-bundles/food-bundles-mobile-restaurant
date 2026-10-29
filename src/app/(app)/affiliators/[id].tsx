import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { hit, radius, space, text, useTheme } from '@/theme';
import { ScreenHeader } from '@/components/layout';
import { Input } from '@/components/primitives';
import { useAffiliatorsStore } from '@/stores';
import { useT } from '@/i18n';
import { formatRwf } from '@/lib';
import type { Affiliator } from '@/types';

export default function AffiliatorDetail() {
  const t = useT();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const getById = useAffiliatorsStore((s) => s.getById);
  const update = useAffiliatorsStore((s) => s.update);
  const remove = useAffiliatorsStore((s) => s.remove);
  const listAffiliator = useAffiliatorsStore((s) => s.affiliators.find((a) => a.id === id));

  const [affiliator, setAffiliator] = useState<Affiliator | null>(listAffiliator ?? null);
  const [loadingDetail, setLoadingDetail] = useState(!listAffiliator?.orders);
  const [name, setName] = useState(listAffiliator?.name ?? '');
  const [phone, setPhone] = useState(listAffiliator?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoadingDetail(true);
    getById(id)
      .then((a) => {
        setAffiliator(a);
        setName(a.name);
        setPhone(a.phone ?? '');
      })
      .catch(() => { /* use list data */ })
      .finally(() => setLoadingDetail(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSave = async () => {
    if (!id || !name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await update(id, { name: name.trim(), phone: phone.trim() || undefined });
      router.back();
    } catch (err: any) {
      setError(err?.message ?? t('aff_updateFailed'));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = () => {
    Alert.alert(
      t('aff_deleteTitle'),
      t('aff_deleteConfirm', { name: affiliator?.name ?? '' }),
      [
        { text: t('aff_cancel'), style: 'cancel' },
        {
          text: t('aff_delete'),
          style: 'destructive',
          onPress: async () => {
            if (!id) return;
            setDeleting(true);
            try {
              await remove(id);
              router.back();
            } catch (err: any) {
              setError(err?.message ?? t('aff_deleteFailed'));
              setDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.oat }]}>
      <ScreenHeader title={affiliator?.name ?? t('aff_title')} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Edit form */}
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('aff_editDetails')}</Text>
        <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
          <Input label={t('aff_fullName')} value={name} onChangeText={setName} />
          <View style={styles.fieldGap}>
            <Input label={t('aff_phone')} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          {affiliator?.email ? (
            <View style={styles.fieldGap}>
              <Text style={[styles.emailLabel, { color: colors.secondary }]}>{t('aff_emailCredentials')}</Text>
              <Text style={[styles.emailValue, { color: colors.ink }]}>{affiliator.email}</Text>
              <Text style={[styles.emailNote, { color: colors.muted }]}>{t('aff_emailCannotChange')}</Text>
            </View>
          ) : null}
          {error ? (
            <Text style={[styles.errorText, { color: colors.chili }]}>{error}</Text>
          ) : null}
          <Pressable
            onPress={onSave}
            disabled={saving || !name.trim()}
            accessibilityRole="button"
            style={[
              styles.saveBtn,
              { backgroundColor: colors.leaf },
              (saving || !name.trim()) && styles.btnDisabled,
            ]}
          >
            {saving
              ? <ActivityIndicator color={colors.paper} />
              : <Text style={[styles.saveBtnLabel, { color: colors.paper }]}>{t('aff_saveChanges')}</Text>}
          </Pressable>
        </View>

        {/* Orders */}
        <Text style={[styles.sectionLabel, { color: colors.secondary }]}>{t('aff_ordersTitle')}</Text>
        {loadingDetail ? (
          <ActivityIndicator color={colors.leaf} style={styles.loader} />
        ) : !affiliator?.orders || affiliator.orders.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.secondary }]}>{t('aff_noOrders')}</Text>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.paper, borderColor: colors.hairline }]}>
            {affiliator.orders.map((order, idx) => (
              <View key={order.id}>
                {idx > 0 && <View style={[styles.divider, { backgroundColor: colors.hairline }]} />}
                <View style={styles.orderRow}>
                  <View style={styles.orderLeft}>
                    <Text style={[styles.orderNumber, { color: colors.ink }]}>#{order.orderNumber}</Text>
                    <Text style={[styles.orderDate, { color: colors.muted }]}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.orderRight}>
                    <Text style={[styles.orderAmount, { color: colors.ink }]}>{formatRwf(order.totalAmount)}</Text>
                    <View style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          order.status === 'DELIVERED' ? colors.tintRipe :
                          order.status === 'CANCELLED' ? colors.chili + '20' : colors.tintMarigold,
                      },
                    ]}>
                      <Text style={[styles.statusText, {
                        color:
                          order.status === 'DELIVERED' ? colors.tintedGreenText :
                          order.status === 'CANCELLED' ? colors.chili : colors.tintedAmberText,
                      }]}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Delete */}
        <Pressable
          onPress={onDelete}
          disabled={deleting}
          accessibilityRole="button"
          style={[styles.deleteBtn, { borderColor: colors.chili }, deleting && styles.btnDisabled]}
        >
          {deleting
            ? <ActivityIndicator color={colors.chili} />
            : <Text style={[styles.deleteBtnLabel, { color: colors.chili }]}>{t('aff_deleteAffiliator')}</Text>}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: space.md, gap: space.sm, paddingBottom: space.xl },
  sectionLabel: { ...text.overline, marginTop: space.md, marginBottom: space.xs ?? space.sm },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: space.md, gap: space.sm },
  fieldGap: { marginTop: space.sm },
  emailLabel: { ...text.caption },
  emailValue: { ...text.body },
  emailNote: { ...text.micro, marginTop: 2 },
  errorText: { ...text.caption },
  saveBtn: { minHeight: hit.min, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginTop: space.sm },
  saveBtnLabel: { ...text.bodySemi },
  btnDisabled: { opacity: 0.5 },
  loader: { marginTop: space.md },
  emptyText: { ...text.body, textAlign: 'center', marginTop: space.sm },
  divider: { height: 1 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: space.sm },
  orderLeft: { flex: 1 },
  orderNumber: { ...text.bodySemi },
  orderDate: { ...text.micro, marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 4 },
  orderAmount: { ...text.bodySemi },
  statusBadge: { borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2 },
  statusText: { ...text.micro, fontWeight: '600' },
  deleteBtn: {
    minHeight: hit.min,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: space.lg,
  },
  deleteBtnLabel: { ...text.bodySemi },
});
