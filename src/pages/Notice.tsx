import { useLocation } from 'react-router-dom';
import PostBoard from '../components/board/PostBoard';

export default function Notice() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PostBoard
            title={isCompany ? "기업 공지사항" : "공지사항"}
            storageKey={isCompany ? "board_notice_company" : "board_notice"}
        />
    );
}
