import { useLocation } from 'react-router-dom';
import PostBoard from '../components/board/PostBoard';

export default function News() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PostBoard
            title={isCompany ? "기업 뉴스" : "뉴스"}
            storageKey={isCompany ? "board_news_company" : "board_news"}
        />
    );
}
