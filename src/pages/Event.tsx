import { useLocation } from 'react-router-dom';
import PostBoard from '../components/board/PostBoard';

export default function Event() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PostBoard
            title={isCompany ? "기업 이벤트" : "이벤트"}
            storageKey={isCompany ? "board_event_company" : "board_event"}
        />
    );
}
