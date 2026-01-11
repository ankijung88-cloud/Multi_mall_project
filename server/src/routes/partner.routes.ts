import { Router } from 'express';
import axios from 'axios';
import prisma from '../db';

const router = Router();
router.get('/', async (req, res) => {
    try {
        const partners = await prisma.partner.findMany({
            include: { schedules: true }
        });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch partners' });
    }
});

router.post('/', async (req, res) => {
    const { schedules, credentials, ...data } = req.body;

    // Spread credentials if they exist
    const partnerData = {
        ...data,
        username: credentials?.username,
        password: credentials?.password
    };

    try {
        const partner = await prisma.partner.create({
            data: {
                ...partnerData,
                schedules: {
                    create: schedules || []
                }
            },
            include: { schedules: true }
        });
        res.json(partner);
    } catch (error) {
        console.error("Create partner error:", error);
        res.status(500).json({ error: 'Failed to create partner' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { schedules, credentials, ...data } = req.body;
    console.log("UPDATE PARTNER: Received Body:", JSON.stringify(req.body, null, 2));
    console.log("UPDATE PARTNER: Schedules:", JSON.stringify(schedules, null, 2));

    const partnerData = {
        ...data,
        ...(credentials ? { username: credentials.username, password: credentials.password } : {})
    };

    try {
        const partner = await prisma.partner.update({
            where: { id: Number(id) },
            data: {
                ...partnerData,
                schedules: {
                    deleteMany: {}, // Remove old schedules
                    create: schedules || [] // create new ones
                }
            },
            include: { schedules: true }
        });

        res.json(partner);
    } catch (error) {
        console.error("Update partner error:", error);
        res.status(500).json({ error: 'Failed to update partner' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.partner.delete({ where: { id: Number(id) } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete partner' });
    }
});

// Travel Restaurant API (Hybrid: TourAPI + Mock)
router.get('/travel/restaurants', async (req, res) => {
    const region = req.query.region as string || 'All';
    const apiKey = process.env.TOUR_API_KEY;

    // TourAPI Area Codes
    const areaCodes: { [key: string]: string } = {
        'Seoul': '1',
        'Incheon': '2',
        'Busan': '6',
        'Jeju': '39',
        // Add others if needed
    };

    // 1. Try Fetching from Open API
    if (apiKey) {
        try {
            const keyword = req.query.keyword as string;
            let apiUrl = 'http://apis.data.go.kr/B551011/KorService1/areaBasedList1';
            let params: any = {
                serviceKey: apiKey,
                numOfRows: 12,
                pageNo: 1,
                MobileOS: 'ETC',
                MobileApp: 'MultiMall',
                _type: 'json',
                contentTypeId: 39,
                arrange: 'P' // Popularity
            };

            if (keyword) {
                console.log(`Fetching from TourAPI (Search): ${keyword}`);
                apiUrl = 'http://apis.data.go.kr/B551011/KorService1/searchKeyword1';
                params.keyword = keyword;
                // TourAPI searchKeyword1 usually requires listYN=Y
                params.listYN = 'Y';
            } else {
                const areaCode = areaCodes[region];
                console.log(`Fetching from TourAPI (Region): ${region} (Code: ${areaCode || 'All'})`);
                params.areaCode = areaCode || undefined;
            }

            const response = await axios.get(apiUrl, { params });
            const items = response.data?.response?.body?.items?.item;

            if (items && Array.isArray(items)) {
                const mapped = items.map((item: any) => ({
                    id: item.contentid,
                    name: item.title,
                    region: item.addr1 ? item.addr1.split(' ')[0] : 'Unknown',
                    address: item.addr1,
                    hours: "상세 정보 참조",
                    description: "한국관광공사 제공 맛집 정보입니다.",
                    image: item.firstimage || item.firstimage2 || "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80",
                    rating: 0
                }));
                return res.json(mapped);
            } else {
                console.log("TourAPI returned no items or invalid format:", JSON.stringify(response.data));
            }

        } catch (error: any) {
            console.error("TourAPI Request Failed:", error.message);
        }
    }

    // 2. Fallback Mock Data
    const mockRestaurants = [
        {
            id: 1,
            name: "명동교자 (예시)",
            region: "Seoul",
            address: "서울 중구 명동10길 29",
            hours: "10:30 - 21:00",
            description: "손칼국수와 만두로 유명한 명동의 대표 맛집.",
            image: "https://images.unsplash.com/photo-1553163147-621957516919?auto=format&fit=crop&q=80&w=800",
            rating: 4.8
        },
        {
            id: 2,
            name: "토속촌 삼계탕 (예시)",
            region: "Seoul",
            address: "서울 종로구 자하문로5길 5",
            hours: "10:00 - 22:00",
            description: "경복궁 근처 전설적인 삼계탕 맛집.",
            image: "https://images.unsplash.com/photo-1604579278540-33630d8156d2?auto=format&fit=crop&q=80&w=800",
            rating: 4.7
        },
        {
            id: 3,
            name: "해운대 소문난 암소갈비 (예시)",
            region: "Busan",
            address: "부산 해운대구 중동2로10번길 32-10",
            hours: "11:30 - 22:00",
            description: "전통적인 분위기에서 즐기는 프리미엄 소갈비.",
            image: "https://images.unsplash.com/photo-1544025162-d76690b6d012?auto=format&fit=crop&q=80&w=800",
            rating: 4.9
        },
        {
            id: 4,
            name: "쌍둥이 돼지국밥 (예시)",
            region: "Busan",
            address: "부산 남구 유엔평화로 35-1",
            hours: "09:00 - 24:00",
            description: "부산의 소울푸드, 진한 국물의 돼지국밥.",
            image: "https://images.unsplash.com/photo-1572656631137-793529b6b276?auto=format&fit=crop&q=80&w=800",
            rating: 4.6
        },
        {
            id: 5,
            name: "제주 흑돼지 거리 (예시)",
            region: "Jeju",
            address: "제주 제주시 관덕로15길 25",
            hours: "12:00 - 23:00",
            description: "제주 흑돼지 구이를 즐길 수 있는 특화 거리.",
            image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?auto=format&fit=crop&q=80&w=800",
            rating: 4.8
        },
        {
            id: 6,
            name: "명진전복 (예시)",
            region: "Jeju",
            address: "제주 제주시 구좌읍 해맞이해안로 1282",
            hours: "09:30 - 21:30",
            description: "바다 뷰와 함께 즐기는 전복 요리 전문점.",
            image: "https://images.unsplash.com/photo-1626245053155-2244a04d3e8e?auto=format&fit=crop&q=80&w=800",
            rating: 4.7
        },
        {
            id: 7,
            name: "공화춘 (예시)",
            region: "Incheon",
            address: "인천 중구 차이나타운로 43",
            hours: "10:00 - 21:30",
            description: "차이나타운에 위치한 짜장면의 원조.",
            image: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800",
            rating: 4.5
        },
        {
            id: 8,
            name: "송도 한옥마을 (예시)",
            region: "Incheon",
            address: "인천 연수구 컨벤시아대로 175",
            hours: "11:30 - 22:00",
            description: "아름다운 한옥 마을에서 즐기는 파인 다이닝.",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
            rating: 4.7
        }
    ];

    const keyword = req.query.keyword as string;
    let result = mockRestaurants;

    if (keyword) {
        result = result.filter(r =>
            r.name.toLowerCase().includes(keyword.toLowerCase()) ||
            r.description.toLowerCase().includes(keyword.toLowerCase())
        );
    } else if (region && region !== 'All') {
        result = result.filter(r => r.region === region);
    }

    res.json(result);
});

// Partner Requests
router.get('/requests', async (req, res) => {
    try {
        const requests = await prisma.partnerRequest.findMany();
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

router.post('/requests', async (req, res) => {
    console.log("[POST] /requests - Received Body:", JSON.stringify(req.body, null, 2));
    try {
        const request = await prisma.partnerRequest.create({
            data: req.body
        });
        console.log("[POST] /requests - Created Request:", JSON.stringify(request, null, 2));
        res.json(request);
    } catch (error) {
        console.error("[POST] /requests - Create Error:", error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});

router.put('/requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const request = await prisma.partnerRequest.update({
            where: { id },
            data: req.body
        });
        res.json(request);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update request' });
    }
});

router.delete('/requests/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.partnerRequest.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

export default router;
