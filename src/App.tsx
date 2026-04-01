import { useState, useCallback } from 'react';

interface BlogPost {
  title: string;
  subtitle: string;
  content: string;
  hashtags: string[];
  estimatedTime: string;
}

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BlogPost | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImage(e.dataTransfer.files[0]);
    }
  }, []);

  const handleImage = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const generateBlog = async () => {
    if (!image) return;
    
    setIsLoading(true);
    
    // 실제 Gemini API를 연결하면 여기서 호출됩니다.
    // 지금은 데모용 가짜 데이터를 보여줍니다.
    setTimeout(() => {
      setResult({
        title: "서울 숨은 카페에서 찾은 특별한 순간",
        subtitle: "사진 한 장으로 시작된 감성 에세이",
        content: `이번 주말, 우연히 들어간 골목길 끝에 위치한 작은 카페에서 이 사진을 찍었습니다.\n\n오래된 나무 테이블 위에 놓인 라떼와 창밖으로 보이는 빗길이 만들어낸 분위기가 너무 특별해서 한참을 바라보았습니다. \n\n현대 사회에서 우리는 너무 빠르게 살아가고 있는 것 같아요. 가끔은 이렇게 작은 순간들에 더 집중할 필요가 있지 않을까요?\n\n사진을 통해 느껴지는 감정과 생각을 글로 풀어내보았습니다. 여러분에게도 작은 여유와 감성을 전할 수 있기를 바랍니다.`,
        hashtags: ["#감성", "#카페투어", "#서울숨은맛집", "#일상기록", "#사진에세이"],
        estimatedTime: "8분"
      });
      setIsLoading(false);
    }, 2200);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            Photo2Blog
          </h1>
          <p className="text-zinc-400 text-xl">사진 하나로 완성되는 블로그 글</p>
        </div>

        {!image ? (
          <div 
            className={`glass border-2 border-dashed rounded-3xl p-16 text-center upload-area ${dragActive ? 'border-white bg-white/5' : 'border-zinc-700'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <i className="fas fa-cloud-upload-alt text-6xl text-zinc-500 mb-6"></i>
            <h3 className="text-2xl font-semibold mb-3">사진을 업로드하세요</h3>
            <p className="text-zinc-500 mb-8">JPG, PNG, WEBP 파일 지원 • 드래그하거나 클릭하세요</p>
            
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleImage(e.target.files[0])}
            />
            
            <button className="bg-white text-black px-8 py-3.5 rounded-full font-medium hover:bg-zinc-200 transition">
              사진 선택하기
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="glass rounded-3xl overflow-hidden">
              <img src={image} alt="uploaded" className="w-full max-h-[420px] object-cover" />
            </div>

            {!result && (
              <div className="flex gap-4">
                <button
                  onClick={generateBlog}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 py-4 rounded-2xl font-semibold text-lg hover:brightness-110 transition disabled:opacity-70"
                >
                  {isLoading ? "블로그 글 생성중..." : "✍️ 블로그 글 생성하기"}
                </button>
                
                <button
                  onClick={reset}
                  className="px-8 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-900 transition"
                >
                  다시 선택
                </button>
              </div>
            )}

            {result && (
              <div className="glass rounded-3xl p-10">
                <h2 className="text-3xl font-bold mb-2">{result.title}</h2>
                <p className="text-zinc-400 mb-8">{result.subtitle}</p>
                
                <div className="prose prose-invert max-w-none text-zinc-200 leading-relaxed">
                  {result.content.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">{paragraph}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-10">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="bg-zinc-900 text-zinc-400 px-4 py-1.5 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    onClick={reset}
                    className="flex-1 py-4 border border-zinc-700 rounded-2xl hover:bg-zinc-900"
                  >
                    다른 사진으로 만들기
                  </button>
                  <button className="flex-1 bg-white text-black py-4 rounded-2xl font-semibold">
                    글 복사하기
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
