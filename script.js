// 英文-中文詞典（包含常見單字）
const dictionary = {
    'book': { chinese: '書籍', pos: '名詞' },
    'happy': { chinese: '快樂的', pos: '形容詞' },
    'run': { chinese: '跑步', pos: '動詞' },
    'friend': { chinese: '朋友', pos: '名詞' },
    'beautiful': { chinese: '美麗的', pos: '形容詞' },
    'study': { chinese: '學習', pos: '動詞' },
    'school': { chinese: '學校', pos: '名詞' },
    'quickly': { chinese: '快速地', pos: '副詞' },
    'computer': { chinese: '電腦', pos: '名詞' },
    'interesting': { chinese: '有趣的', pos: '形容詞' },
    'apple': { chinese: '蘋果', pos: '名詞' },
    'dog': { chinese: '狗', pos: '名詞' },
    'cat': { chinese: '貓', pos: '名詞' },
    'eat': { chinese: '吃', pos: '動詞' },
    'drink': { chinese: '喝', pos: '動詞' },
    'sleep': { chinese: '睡眠', pos: '動詞' },
    'walk': { chinese: '走路', pos: '動詞' },
    'jump': { chinese: '跳躍', pos: '動詞' },
    'sing': { chinese: '唱歌', pos: '動詞' },
    'dance': { chinese: '跳舞', pos: '動詞' },
    'play': { chinese: '玩', pos: '動詞' },
    'work': { chinese: '工作', pos: '動詞' },
    'help': { chinese: '幫助', pos: '動詞' },
    'love': { chinese: '愛', pos: '動詞' },
    'like': { chinese: '喜歡', pos: '動詞' },
    'want': { chinese: '想要', pos: '動詞' },
    'need': { chinese: '需要', pos: '動詞' },
    'think': { chinese: '認為', pos: '動詞' },
    'know': { chinese: '知道', pos: '動詞' },
    'go': { chinese: '去', pos: '動詞' },
    'come': { chinese: '來', pos: '動詞' },
    'see': { chinese: '看見', pos: '動詞' },
    'hear': { chinese: '聽見', pos: '動詞' },
    'blue': { chinese: '藍色', pos: '形容詞' },
    'red': { chinese: '紅色', pos: '形容詞' },
    'green': { chinese: '綠色', pos: '形容詞' },
    'yellow': { chinese: '黃色', pos: '形容詞' },
    'big': { chinese: '大的', pos: '形容詞' },
    'small': { chinese: '小的', pos: '形容詞' },
    'good': { chinese: '好的', pos: '形容詞' },
    'bad': { chinese: '壞的', pos: '形容詞' },
    'hot': { chinese: '熱的', pos: '形容詞' },
    'cold': { chinese: '冷的', pos: '形容詞' },
    'fast': { chinese: '快速的', pos: '形容詞' },
    'slow': { chinese: '緩慢的', pos: '形容詞' },
    'easy': { chinese: '容易的', pos: '形容詞' },
    'difficult': { chinese: '困難的', pos: '形容詞' },
    'young': { chinese: '年輕的', pos: '形容詞' },
    'old': { chinese: '老的', pos: '形容詞' },
    'new': { chinese: '新的', pos: '形容詞' },
    'house': { chinese: '房子', pos: '名詞' },
    'tree': { chinese: '樹', pos: '名詞' },
    'flower': { chinese: '花', pos: '名詞' },
    'water': { chinese: '水', pos: '名詞' },
    'fire': { chinese: '火', pos: '名詞' },
    'air': { chinese: '空氣', pos: '名詞' },
    'sun': { chinese: '太陽', pos: '名詞' },
    'moon': { chinese: '月亮', pos: '名詞' },
    'star': { chinese: '星星', pos: '名詞' },
    'sky': { chinese: '天空', pos: '名詞' },
    'sea': { chinese: '海', pos: '名詞' },
    'mountain': { chinese: '山', pos: '名詞' },
    'river': { chinese: '河', pos: '名詞' },
    'table': { chinese: '桌子', pos: '名詞' },
    'chair': { chinese: '椅子', pos: '名詞' },
    'door': { chinese: '門', pos: '名詞' },
    'window': { chinese: '窗戶', pos: '名詞' },
    'floor': { chinese: '地板', pos: '名詞' },
    'wall': { chinese: '牆壁', pos: '名詞' },
    'roof': { chinese: '屋頂', pos: '名詞' },
    'road': { chinese: '道路', pos: '名詞' },
    'street': { chinese: '街道', pos: '名詞' },
    'car': { chinese: '汽車', pos: '名詞' },
    'bus': { chinese: '巴士', pos: '名詞' },
    'train': { chinese: '火車', pos: '名詞' },
    'bike': { chinese: '自行車', pos: '名詞' },
    'phone': { chinese: '電話', pos: '名詞' },
    'pencil': { chinese: '鉛筆', pos: '名詞' },
    'pen': { chinese: '鋼筆', pos: '名詞' },
    'paper': { chinese: '紙', pos: '名詞' },
    'money': { chinese: '金錢', pos: '名詞' },
    'person': { chinese: '人', pos: '名詞' },
    'man': { chinese: '男人', pos: '名詞' },
    'woman': { chinese: '女人', pos: '名詞' },
    'boy': { chinese: '男孩', pos: '名詞' },
    'girl': { chinese: '女孩', pos: '名詞' },
    'teacher': { chinese: '老師', pos: '名詞' },
    'student': { chinese: '學生', pos: '名詞' },
    'family': { chinese: '家庭', pos: '名詞' },
    'father': { chinese: '爸爸', pos: '名詞' },
    'mother': { chinese: '媽媽', pos: '名詞' },
    'sister': { chinese: '姐妹', pos: '名詞' },
    'brother': { chinese: '兄弟', pos: '名詞' },
    'food': { chinese: '食物', pos: '名詞' },
    'bread': { chinese: '麵包', pos: '名詞' },
    'rice': { chinese: '米飯', pos: '名詞' },
    'meat': { chinese: '肉', pos: '名詞' },
    'fish': { chinese: '魚', pos: '名詞' },
    'egg': { chinese: '蛋', pos: '名詞' },
    'milk': { chinese: '牛奶', pos: '名詞' },
    'juice': { chinese: '果汁', pos: '名詞' },
    'tea': { chinese: '茶', pos: '名詞' },
    'coffee': { chinese: '咖啡', pos: '名詞' },
    'fruit': { chinese: '水果', pos: '名詞' },
    'orange': { chinese: '橘子', pos: '名詞' },
    'banana': { chinese: '香蕉', pos: '名詞' },
    'strawberry': { chinese: '草莓', pos: '名詞' },
    'grape': { chinese: '葡萄', pos: '名詞' },
    'medicine': { chinese: '藥', pos: '名詞' },
    'hospital': { chinese: '醫院', pos: '名詞' },
    'doctor': { chinese: '醫生', pos: '名詞' },
    'nurse': { chinese: '護士', pos: '名詞' },
    'time': { chinese: '時間', pos: '名詞' },
    'day': { chinese: '日', pos: '名詞' },
    'night': { chinese: '晚上', pos: '名詞' },
    'week': { chinese: '週', pos: '名詞' },
    'month': { chinese: '月', pos: '名詞' },
    'year': { chinese: '年', pos: '名詞' },
    'weather': { chinese: '天氣', pos: '名詞' },
    'rain': { chinese: '雨', pos: '名詞' },
    'snow': { chinese: '雪', pos: '名詞' },
    'wind': { chinese: '風', pos: '名詞' },
    'cloud': { chinese: '雲', pos: '名詞' },
    'slowly': { chinese: '緩慢地', pos: '副詞' },
    'happily': { chinese: '開心地', pos: '副詞' },
    'carefully': { chinese: '小心地', pos: '副詞' },
    'easily': { chinese: '容易地', pos: '副詞' },
    'well': { chinese: '好地', pos: '副詞' },
    'very': { chinese: '非常', pos: '副詞' },
    'here': { chinese: '這裡', pos: '副詞' },
    'there': { chinese: '那裡', pos: '副詞' },
    'now': { chinese: '現在', pos: '副詞' },
    'today': { chinese: '今天', pos: '名詞' },
    'tomorrow': { chinese: '明天', pos: '名詞' },
    'yesterday': { chinese: '昨天', pos: '名詞' },
    'always': { chinese: '總是', pos: '副詞' },
    'never': { chinese: '從不', pos: '副詞' },
    'sometimes': { chinese: '有時', pos: '副詞' },
    'often': { chinese: '經常', pos: '副詞' },
    'usually': { chinese: '通常', pos: '副詞' },
    'only': { chinese: '只', pos: '副詞' },
    'also': { chinese: '也', pos: '副詞' },
    'very': { chinese: '很', pos: '副詞' },
    'theory': { chinese: '理論', pos: '名詞' },
    'concept': { chinese: '概念', pos: '名詞' },
    'research': { chinese: '研究', pos: '名詞' },
    'environment': { chinese: '環境', pos: '名詞' },
    'climate': { chinese: '氣候', pos: '名詞' },
    'population': { chinese: '人口', pos: '名詞' },
    'culture': { chinese: '文化', pos: '名詞' },
    'history': { chinese: '歷史', pos: '名詞' },
    'literature': { chinese: '文學', pos: '名詞' },
    'biology': { chinese: '生物學', pos: '名詞' },
    'chemistry': { chinese: '化學', pos: '名詞' },
    'physics': { chinese: '物理', pos: '名詞' },
    'solution': { chinese: '解決方法', pos: '名詞' },
    'energy': { chinese: '能量', pos: '名詞' },
    'technology': { chinese: '科技', pos: '名詞' },
    'analyze': { chinese: '分析', pos: '動詞' },
    'achieve': { chinese: '達成', pos: '動詞' },
    'compare': { chinese: '比較', pos: '動詞' },
    'improve': { chinese: '改善', pos: '動詞' },
    'important': { chinese: '重要的', pos: '形容詞' }
};

// 預設的10個國中英文單字
const defaultWords = [
    {
        english: 'book',
        chinese: '書籍',
        partOfSpeech: '名詞',
        example: 'I read a book every day.'
    },
    {
        english: 'happy',
        chinese: '快樂的',
        partOfSpeech: '形容詞',
        example: 'She is very happy about the news.'
    },
    {
        english: 'run',
        chinese: '跑步',
        partOfSpeech: '動詞',
        example: 'He runs in the park every morning.'
    },
    {
        english: 'friend',
        chinese: '朋友',
        partOfSpeech: '名詞',
        example: 'My best friend is very kind.'
    },
    {
        english: 'beautiful',
        chinese: '美麗的',
        partOfSpeech: '形容詞',
        example: 'The sunset is beautiful tonight.'
    },
    {
        english: 'study',
        chinese: '學習',
        partOfSpeech: '動詞',
        example: 'I study English every evening.'
    },
    {
        english: 'school',
        chinese: '學校',
        partOfSpeech: '名詞',
        example: 'I go to school by bus.'
    },
    {
        english: 'quickly',
        chinese: '快速地',
        partOfSpeech: '副詞',
        example: 'She runs quickly to catch the bus.'
    },
    {
        english: 'computer',
        chinese: '電腦',
        partOfSpeech: '名詞',
        example: 'This computer is very fast.'
    },
    {
        english: 'interesting',
        chinese: '有趣的',
        partOfSpeech: '形容詞',
        example: 'This is an interesting movie.'
    },
    {
        english: 'theory',
        chinese: '理論',
        partOfSpeech: '名詞',
        example: 'The theory explains the problem clearly.'
    },
    {
        english: 'concept',
        chinese: '概念',
        partOfSpeech: '名詞',
        example: 'The concept is easy to understand in class.'
    },
    {
        english: 'research',
        chinese: '研究',
        partOfSpeech: '名詞',
        example: 'Her research about climate change is impressive.'
    },
    {
        english: 'environment',
        chinese: '環境',
        partOfSpeech: '名詞',
        example: 'We should protect the environment every day.'
    },
    {
        english: 'climate',
        chinese: '氣候',
        partOfSpeech: '名詞',
        example: 'The climate here is warm in summer.'
    },
    {
        english: 'population',
        chinese: '人口',
        partOfSpeech: '名詞',
        example: 'The city has a large population.'
    },
    {
        english: 'culture',
        chinese: '文化',
        partOfSpeech: '名詞',
        example: 'Traveling helps me learn about culture.'
    },
    {
        english: 'history',
        chinese: '歷史',
        partOfSpeech: '名詞',
        example: 'History class is full of interesting stories.'
    },
    {
        english: 'literature',
        chinese: '文學',
        partOfSpeech: '名詞',
        example: 'We read literature in our English class.'
    },
    {
        english: 'biology',
        chinese: '生物學',
        partOfSpeech: '名詞',
        example: 'Biology teaches us about living things.'
    },
    {
        english: 'chemistry',
        chinese: '化學',
        partOfSpeech: '名詞',
        example: 'Chemistry experiments are fun and safe.'
    },
    {
        english: 'physics',
        chinese: '物理',
        partOfSpeech: '名詞',
        example: 'Physics explains how objects move.'
    },
    {
        english: 'solution',
        chinese: '解決方法',
        partOfSpeech: '名詞',
        example: 'We need a solution for the math problem.'
    },
    {
        english: 'energy',
        chinese: '能量',
        partOfSpeech: '名詞',
        example: 'The sun gives us energy every day.'
    },
    {
        english: 'technology',
        chinese: '科技',
        partOfSpeech: '名詞',
        example: 'Technology makes learning easier.'
    },
    {
        english: 'analyze',
        chinese: '分析',
        partOfSpeech: '動詞',
        example: 'We analyze data in science class.'
    },
    {
        english: 'achieve',
        chinese: '達成',
        partOfSpeech: '動詞',
        example: 'He can achieve his goals with hard work.'
    },
    {
        english: 'compare',
        chinese: '比較',
        partOfSpeech: '動詞',
        example: 'Compare the two pictures carefully.'
    },
    {
        english: 'improve',
        chinese: '改善',
        partOfSpeech: '動詞',
        example: 'Practice can improve your performance.'
    },
    {
        english: 'important',
        chinese: '重要的',
        partOfSpeech: '形容詞',
        example: 'It is important to study regularly.'
    }
];

// 狀態管理
let words = [];
let currentCardIndex = 0;

// 初始化應用
function init() {
    // 從 localStorage 讀取單字，如果沒有就使用預設單字
    const savedWords = localStorage.getItem('vocab_words');
    if (savedWords) {
        words = JSON.parse(savedWords);
    } else {
        words = JSON.parse(JSON.stringify(defaultWords));
        saveWords();
    }

    renderCards();
    updateUI();
    setupEventListeners();
}

// 儲存單字到 localStorage
function saveWords() {
    localStorage.setItem('vocab_words', JSON.stringify(words));
}

// 設定事件監聽器
function setupEventListeners() {
    // 卡片翻轉
    document.addEventListener('click', (e) => {
        if (e.target.closest('.card')) {
            const card = e.target.closest('.card');
            card.classList.toggle('flipped');
        }

        if (e.target.closest('.delete-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            deleteWord(index);
        }
    });

    // 導航按鈕
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentCardIndex > 0) {
            currentCardIndex--;
            scrollToCard();
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentCardIndex < words.length - 1) {
            currentCardIndex++;
            scrollToCard();
        }
    });

    // 管理介面切換
    document.getElementById('toggleManager').addEventListener('click', () => {
        const learningArea = document.getElementById('learningArea');
        const managerArea = document.getElementById('managerArea');
        learningArea.classList.add('hidden');
        managerArea.classList.remove('hidden');
        renderWordsList();
    });

    document.getElementById('closeManager').addEventListener('click', () => {
        const learningArea = document.getElementById('learningArea');
        const managerArea = document.getElementById('managerArea');
        learningArea.classList.remove('hidden');
        managerArea.classList.add('hidden');
    });

    // 新增單字表單
    document.getElementById('addWordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        addWord();
    });

    // 英文輸入框自動查詞典
    const englishInput = document.getElementById('english');
    const chineseInput = document.getElementById('chinese');
    const posSelect = document.getElementById('partOfSpeech');

    englishInput.addEventListener('input', () => {
        const inputValue = englishInput.value.trim().toLowerCase();
        
        if (inputValue && dictionary[inputValue]) {
            // 如果字典中有這個單字，自動填入中文和詞性
            const wordData = dictionary[inputValue];
            chineseInput.value = wordData.chinese;
            posSelect.value = wordData.pos;
        } else if (!inputValue) {
            // 如果輸入框為空，清空中文和詞性
            chineseInput.value = '';
            posSelect.value = '';
        }
    });

    // 鍵盤快捷鍵
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            document.getElementById('prevBtn').click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('nextBtn').click();
        }
    });
}

// 渲染卡片
function renderCards() {
    const cardsList = document.getElementById('cardsList');
    cardsList.innerHTML = '';

    words.forEach((word, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        if (index !== currentCardIndex) {
            card.style.display = 'none';
        }

        card.innerHTML = `
            <div class="card-front card-face">
                <div class="card-hint">點擊翻轉</div>
                <div>${word.english}</div>
            </div>
            <div class="card-back card-face">
                <div class="card-back-content">
                    <div class="card-back-item">
                        <div class="card-back-label">中文</div>
                        <div class="card-back-value">${word.chinese}</div>
                    </div>
                    <div class="card-back-item">
                        <div class="card-back-label">詞性</div>
                        <div class="card-back-value">${word.partOfSpeech}</div>
                    </div>
                    ${word.example ? `
                    <div class="card-back-item">
                        <div class="card-back-label">例句</div>
                        <div class="card-back-value example">${word.example}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

        cardsList.appendChild(card);
    });
}

// 捲動到當前卡片
function scrollToCard() {
    const cardsList = document.getElementById('cardsList');
    const cards = cardsList.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.display = index === currentCardIndex ? 'block' : 'none';
        if (index === currentCardIndex) {
            card.classList.remove('flipped');
        }
    });
    updateUI();
}

// 更新 UI
function updateUI() {
    document.getElementById('currentCard').textContent = currentCardIndex + 1;
    document.getElementById('totalCards').textContent = words.length;

    // 更新進度條
    const progress = ((currentCardIndex + 1) / words.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';

    // 更新按鈕狀態
    document.getElementById('prevBtn').disabled = currentCardIndex === 0;
    document.getElementById('nextBtn').disabled = currentCardIndex === words.length - 1;
}

// 新增單字
function addWord() {
    const english = document.getElementById('english').value.trim();
    const chinese = document.getElementById('chinese').value.trim();
    const partOfSpeech = document.getElementById('partOfSpeech').value.trim();
    const example = document.getElementById('example').value.trim();

    if (!english || !chinese || !partOfSpeech) {
        alert('請填寫所有必填欄位');
        return;
    }

    // 檢查是否已存在相同的英文單字
    if (words.some(w => w.english.toLowerCase() === english.toLowerCase())) {
        alert('這個單字已經存在！');
        return;
    }

    // 新增單字
    words.push({
        english,
        chinese,
        partOfSpeech,
        example
    });

    // 儲存並更新 UI
    saveWords();
    currentCardIndex = words.length - 1;  // 跳轉到新增的單字

    // 清空表單
    document.getElementById('addWordForm').reset();

    // 顯示成功提示
    showSuccessMessage('單字已成功新增！');

    // 更新單字列表
    renderWordsList();

    // 返回學習區域
    setTimeout(() => {
        document.getElementById('learningArea').classList.remove('hidden');
        document.getElementById('managerArea').classList.add('hidden');
        renderCards();
        updateUI();
    }, 1500);
}

// 刪除單字
function deleteWord(index) {
    if (confirm(`確定要刪除 "${words[index].english}" 嗎？`)) {
        words.splice(index, 1);
        saveWords();

        if (words.length === 0) {
            alert('已刪除所有單字！');
            currentCardIndex = 0;
        } else if (currentCardIndex >= words.length) {
            currentCardIndex = words.length - 1;
        }

        renderCards();
        renderWordsList();
        updateUI();
        showSuccessMessage('單字已刪除');
    }
}

// 渲染單字列表
function renderWordsList() {
    const wordsList = document.getElementById('wordsList');
    const wordCount = document.getElementById('wordCount');

    wordCount.textContent = words.length;

    if (words.length === 0) {
        wordsList.innerHTML = '<p style="color: #999; text-align: center;">暫無單字</p>';
        return;
    }

    wordsList.innerHTML = words.map((word, index) => `
        <div class="word-item">
            <button class="delete-btn" data-index="${index}" title="刪除">×</button>
            <div class="word-item-english">${word.english}</div>
            <div class="word-item-chinese">${word.chinese}</div>
            <div class="word-item-pos">${word.partOfSpeech}</div>
            ${word.example ? `<div style="font-size: 0.85em; color: #666; margin-top: 8px; font-style: italic;">"${word.example}"</div>` : ''}
        </div>
    `).join('');
}

// 顯示成功訊息
function showSuccessMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    document.body.insertBefore(messageDiv, document.body.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// 初始化應用
init();
