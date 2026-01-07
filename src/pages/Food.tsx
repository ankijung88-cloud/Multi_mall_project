import { useLocation } from 'react-router-dom';
import PartnerCategoryPage from './PartnerCategoryPage';

export default function Food() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PartnerCategoryPage
            categoryName={isCompany ? "음식_기업" : "음식"}
            title={isCompany ? "Corporate Dining Services" : "Food & Dining"}
            description={isCompany
                ? "기업 행사 및 회식을 위한 프리미엄 다이닝 서비스를 확인하세요."
                : "최고의 미식 경험을 선사하는 엄선된 푸드 파트너를 만나보세요."
            }
            isCompanyView={isCompany}
        />
    );
}
