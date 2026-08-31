import { makePeriodPage } from "@/components/horoscope/period-page";

export const revalidate = 3600;

const { Page, generateMetadata } = makePeriodPage("daily");
export { generateMetadata };
export default Page;
