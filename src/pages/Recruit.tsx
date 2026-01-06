import { useLocation } from 'react-router-dom';
import PostBoard from '../components/board/PostBoard';

export default function Recruit() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const isCompany = searchParams.get('type') === 'company';

    return (
        <PostBoard
            title={isCompany ? "기업 채용" : "채용"}
            storageKey={isCompany ? "board_recruit_company" : "board_recruit"}
        />
    );
}
