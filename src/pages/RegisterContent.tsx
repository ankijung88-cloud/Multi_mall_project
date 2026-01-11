import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useContents } from '../context/ContentContext';
import { useAuthStore } from '../store/useAuthStore';
import { X } from 'lucide-react';

export default function RegisterContent() {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID for edit mode
    const { uploadContent, updateContent, uploadFile, getContent } = useContents();
    const { user } = useAuthStore();

    // ... items ...

    const [isUploading, setIsUploading] = useState(false);

    // Form States
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [contentUrl, setContentUrl] = useState('');
    const [thumbnail, setThumbnail] = useState<string | null>(null);
    const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [fileName, setFileName] = useState('');

    // Load data if editing
    useEffect(() => {
        if (id) {
            const content = getContent(id);
            if (content) {
                setTitle(content.title);
                setDescription(content.description);
                setPrice(String(content.price));
                setContentUrl(content.contentUrl);
                setThumbnail(content.thumbnailUrl);
                try {
                    setPortfolioImages(JSON.parse(content.detailImages || '[]'));
                } catch (e) {
                    setPortfolioImages([]);
                }
            }
        }
    }, [id, getContent]);

    const handleContentFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = Array.from(e.target.files);

            // Check Size Limit (e.g. 50MB)
            const totalSize = files.reduce((acc, file) => acc + file.size, 0);
            if (totalSize > 50 * 1024 * 1024) {
                alert("총 용량은 50MB를 초과할 수 없습니다.");
                return;
            }

            setIsUploading(true);
            try {
                // Assuming uploadFiles is a new function in useContents that handles multiple files
                // For now, using uploadFile for each file and collecting URLs
                const uploadPromises = files.map(file => uploadFile(file));
                const newUrls = await Promise.all(uploadPromises);

                // Append to existing
                let currentUrls: string[] = [];
                try {
                    if (contentUrl) {
                        // Check if it's already a JSON array or a single string
                        if (contentUrl.startsWith('[')) {
                            currentUrls = JSON.parse(contentUrl);
                        } else {
                            currentUrls = [contentUrl];
                        }
                    }
                } catch {
                    currentUrls = contentUrl ? [contentUrl] : [];
                }

                const updatedUrls = [...currentUrls, ...newUrls];
                setContentUrl(JSON.stringify(updatedUrls));

                alert(`${newUrls.length}개 파일이 추가되었습니다. (총 ${updatedUrls.length}개)`);
            } catch (error) {
                console.error("File upload failed:", error);
                alert("파일 업로드에 실패했습니다.");
            } finally {
                setIsUploading(false);
            }
        }
    };


    // Helper to convert file to Base64
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleThumbnailChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);
            const base64 = await convertToBase64(file);
            setThumbnail(base64);
        }
    };

    const handlePortfolioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const base64 = await convertToBase64(e.target.files[i]);
                newImages.push(base64);
            }
            setPortfolioImages([...portfolioImages, ...newImages]);
        }
    };

    const removePortfolioImage = (index: number) => {
        setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (!thumbnail) return alert("대표 이미지는 필수입니다.");

        setLoading(true);
        try {
            const contentData = {
                userId: String(user.id),
                userName: user.name,
                title,
                description,
                price: Number(price),
                contentUrl,
                thumbnailUrl: thumbnail,
                detailImages: JSON.stringify(portfolioImages)
            };

            if (id) {
                // Update existing
                await updateContent(id, contentData);
                alert('컨텐츠가 성공적으로 수정되었습니다.');
            } else {
                // Create new
                await uploadContent(contentData);
                alert('컨텐츠가 성공적으로 등록되었습니다.');
            }
            navigate('/contents/my'); // Redirect to My Contents
        } catch (error) {
            console.error(error);
            alert(id ? '수정에 실패했습니다.' : '등록에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-8">{id ? '컨텐츠 수정 (Edit Content)' : '컨텐츠 등록 (Register Content)'}</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="컨텐츠 제목을 입력하세요"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">판매 가격 (KRW)</label>
                                <input
                                    type="number"
                                    required
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="0"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">상세 설명</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                                    placeholder="컨텐츠에 대한 설명을 작성해주세요"
                                />
                            </div>

                            {/* Content File Upload (Grid Layout) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">컨텐츠 이미지 업로드/설정 (포트폴리오 겸용)</label>

                                <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="text-sm text-gray-600">
                                            판매할 이미지들을 선택해주세요. (총 50MB 제한)
                                            <br />
                                            <span className="text-xs text-gray-400">4열 4행 그리드로 미리보기가 제공됩니다.</span>
                                        </div>
                                        <label className={`px-6 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 cursor-pointer shadow-sm flex items-center gap-2 ${isUploading ? 'opacity-70 cursor-wait' : ''}`}>
                                            {isUploading ? '업로드 중...' : '이미지 선택'}
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleContentFileChange}
                                                disabled={isUploading}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Preview Grid */}
                                    {contentUrl && (
                                        <div className="grid grid-cols-4 gap-4 mt-4">
                                            {(() => {
                                                try {
                                                    const urls = contentUrl.startsWith('[') ? JSON.parse(contentUrl) : [contentUrl];
                                                    return urls.map((url: string, idx: number) => (
                                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white relative group">
                                                            <img src={url} alt={`Content ${idx}`} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                                                                파일 {idx + 1}
                                                            </div>
                                                        </div>
                                                    ));
                                                } catch {
                                                    return <div className="col-span-4 text-gray-400 text-sm p-4">이미지 미리보기를 불러올 수 없습니다.</div>
                                                }
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">대표 이미지 (썸네일)</label>
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={fileName || thumbnail || ''}
                                            onChange={(e) => {
                                                setThumbnail(e.target.value);
                                                setFileName('');
                                            }}
                                            placeholder="이미지 URL을 입력하거나 파일을 선택하세요"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none transition-all"
                                        />
                                        <label className="px-6 py-3 bg-black text-white font-medium rounded-xl hover:bg-gray-800 cursor-pointer whitespace-nowrap transition-colors shadow-sm">
                                            파일 찾기
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleThumbnailChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {thumbnail && (
                                        <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                            <img
                                                src={thumbnail}
                                                alt="Thumbnail preview"
                                                className="w-full h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnail(null);
                                                    setFileName('');
                                                }}
                                                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Portfolio Images */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">포트폴리오 이미지</label>
                                <div className="space-y-4">
                                    {/* URL Input */}
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            id="portfolioUrlInput"
                                            placeholder="이미지 URL을 입력하고 추가 버튼을 누르세요"
                                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    const input = e.currentTarget as HTMLInputElement;
                                                    if (input.value) {
                                                        setPortfolioImages([...portfolioImages, input.value]);
                                                        input.value = '';
                                                    }
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const input = document.getElementById('portfolioUrlInput') as HTMLInputElement;
                                                if (input.value) {
                                                    setPortfolioImages([...portfolioImages, input.value]);
                                                    input.value = '';
                                                }
                                            }}
                                            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200"
                                        >
                                            추가
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="text-sm font-medium text-gray-700 whitespace-nowrap">다중 이미지 업로드:</div>
                                        <label className="px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 cursor-pointer shadow-sm">
                                            <span>파일 찾기 (여러 장 선택 가능)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handlePortfolioChange}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    {/* Preview Grid */}
                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 mt-4">
                                        {portfolioImages.map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group bg-gray-50">
                                                <img src={img} alt={`Portfolio ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePortfolioImage(idx)}
                                                    className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {loading ? (id ? '수정 중...' : '등록 중...') : (id ? '컨텐츠 수정하기' : '컨텐츠 등록하기')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
