import { useLocation } from 'react-router-dom';
import PartnerCategoryPage from './PartnerCategoryPage';

export default function Travel() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PartnerCategoryPage
            categoryName={isCompany ? "여행_기업" : "여행"}
            title={isCompany ? "Corporate Travel Partners" : "Travel Partners"}
            description={isCompany
                ? "기업 고객을 위한 프리미엄 출장 및 여행 솔루션을 제공합니다."
                : "특별한 여행 경험을 제공하는 다채로운 여행 파트너를 소개합니다."
            }
            isCompanyView={isCompany}
        />
    );
}
