import { View } from 'react-native';
import { ScreenScroll } from '@/components/layout';
import { LandingHeader } from './_components/LandingHeader';
import { LandingHero } from './_components/LandingHero';
import { LandingMarquee } from './_components/LandingMarquee';
import { LandingVouchers } from './_components/LandingVouchers';
import { LandingConnectFarm } from './_components/LandingConnectFarm';
import { LandingSupport } from './_components/LandingSupport';
import { LandingFarms } from './_components/LandingFarms';
import { LandingFarmerBand } from './_components/LandingFarmerBand';
import { LandingFooter } from './_components/LandingFooter';

export default function Landing() {
  return (
    <View style={{ flex: 1 }}>
      <LandingHeader />
      <ScreenScroll contentContainerStyle={{ paddingHorizontal: 0 }}>
        <LandingHero />
        <LandingMarquee />
        <LandingVouchers />
        <LandingConnectFarm />
        <LandingSupport />
        <LandingFarms />
        <LandingFarmerBand />
        <LandingFooter />
      </ScreenScroll>
    </View>
  );
}
