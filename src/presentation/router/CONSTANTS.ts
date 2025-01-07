export const ROOT = '/';

export const AUTH_ROUTES = {
    PATH: '/auth',
    SUB: {
        SIGNIN: 'signin',
        SIGNUP: 'signup',
        MG11: 'MG-1-1',
        MG00401: 'MG-004-01',
        MG00501: 'MG-005-01',
        MG00601: 'MG-006-01',
        MG00701: 'MG-007-01',
    },
};

export const PRIVATE_ROUTES = {
    PATH: '/app',
    SUB: {
        COUNTER: 'counter',
        ADMIN: 'admin',
        USER: 'user',
        MOD: 'mod',
        TIME: 'time',
        DASHBOARD: 'dashboard',
        MG00201: 'MG-002-01',
        MG01301: 'MG-013-01',
        MG013012: 'MG-013-01-2',
        MG00901: 'MG-009-01',
        MG01001: 'MG-010-01',
        MG01101: 'MG-011-01',
        MG01401: 'MG-014-01',
        CHANGE_PASSWORD: 'change-password',
    },
};


export const SCREENFOOTER = [
    {
        listscreen: [
            {
                title: 'TOP',
                url: '/',
                weight: 'bold'
            },
            {
                title: '記事・ニュース検索',
                url: '/',
                weight: 'bold'
            },
            {
                title: '人気記事ランキング',
                url: '/',
                weight: 'bold'
            },
            {
                title: 'マーケットニュースランキング',
                url: '/',
            },
            {
                title: '資産運用研究所',
                url: '/',
            },
            {
                title: '企業価値研究所 <br> アナリストレポートピックアップ <br> Ｑ＆Ｎコーポレートリサーチ',
                url: '/',
            },
            {
                title: 'ゴールベースアプローチ',
                url: '/',
            },
            {
                title: '日本株ストラテジー',
                url: '/',
            },
            {
                title: '米株ストラテジー',
                url: '/',
            },
            {
                title: 'ＦＸストラテジー',
                url: '/',
            },
            {
                title: '上場企業の想定為替レート',
                url: '/',
            },
            {
                title: '資産形成イロハのイ',
                url: '/',
            },
            {
                title: 'まねわクイズ',
                url: '/',
            },
            {
                title: 'QUICK月次調査',
                url: '/',
            },
        ]
    },
    {
        listscreen: [
            {
                title: 'マーケット指標',
                url: '/',
                weight: 'bold',
            },
            {
                title: '日経平均株価',
                url: '/',
            },
            {
                title: 'TOPIX',
                url: '/',
            },
            {
                title: '東証プライム（売買高加重平均株価）',
                url: '/',
            },
            {
                title: '東証スタンダード（売買高加重平均株価）',
                url: '/',
            },
            {
                title: '東証グロース（売買高加重平均株価）',
                url: '/',
            },
            {
                title: '東証グロース市場250指数',
                url: '/',
            },
            {
                title: 'ナスダック総合',
                url: '/',
            },
            {
                title: '米ドル/円',
                url: '/',
            },
            {
                title: '米国債10年',
                url: '/',
            },
            {
                title: '金先物',
                url: '/',
            },
        ]
    }, 
    {
        listscreen: [
            {
                title: '個別株式・株価',
                url: '/',
                weight: 'bold',
            },
            {
                title: '銘柄検索',
                url: '/',
                weight: 'bold',
            },
            {
                title: '株式ランキング',
                url: '/',
                weight: 'bold',
            },
            {
                title: '注目株ランキング',
                url: '/',
            },
            {
                title: '値上がり率ランキング',
                url: '/',
            },
            {
                title: '値下がり率ランキング',
                url: '/',
            },
            {
                title: '売買代金ランキング',
                url: '/',
            },
            {
                title: '時価総額ランキング',
                url: '/',
            },
            {
                title: '米国株銘柄検索',
                url: '/',
                weight: 'bold',
            },
            {
                title: '分析ツール',
                url: '/',
                weight: 'bold',
            },
            {
                title: 'スコア株サーチ',
                url: '/',
            },
            {
                title: 'コンセンサス株サーチ',
                url: '/',
            },
            {
                title: 'コーポレートアラート',
                url: '/',
            },
            {
                title: '簡単業種分析',
                url: '/',
            },
            {
                title: '決算サプライズメーター',
                url: '/',
            },
            {
                title: '金融用語集',
                url: '/',
            },
        ]
    },
    {
        listscreen: [
            {
                title: '企業開示情報',
                url: '/',
                weight: 'bold',
            },
            {
                title: '株主優待',
                url: '/',
                weight: 'bold',
            },
            {
                title: '株主優待検索',
                url: '/',
            },
            {
                title: '新着株主優待一覧',
                url: '/',
            },
            {
                title: '株主優待利回りランキング',
                url: '/',
            },
            {
                title: '配当利回りランキング',
                url: '/',
            },
            {
                title: '優待利回りランキング',
                url: '/',
            },
            {
                title: '優待＆配当利回りランキング',
                url: '/',
            },
            {
                title: 'ユーザー投稿',
                url: '/',
                weight: 'bold',
            },
            {
                title: 'セミナー',
                url: '/',
                weight: 'bold',
            },
        ]
    },
    {
        listscreen: [
            {
                title: 'QUICKについて',
                url: '/',
                weight: 'bold',
            },
            {
                title: 'サイトポリシー',
                url: '/',
                weight: 'bold',
            },
            {
                title: '利用規約',
                url: '/',
                weight: 'bold',
            },
            {
                title: 'ガイドライン',
                url: '/',
                weight: 'bold',
            },
            {
                title: 'お問い合わせ',
                url: '/',
                weight: 'bold',
            },
        ]
    }
]