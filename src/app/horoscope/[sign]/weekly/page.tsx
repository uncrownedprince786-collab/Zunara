import { makePeriodPage } from "@/components/horoscope/period-page";

export const revalidate = 86400;

const { Page, generateMetadata } = makePeriodPage("weekly");
export { generateMetadata };
export default Page;
