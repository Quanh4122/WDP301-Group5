import React from 'react';
import { Col, Layout, List, Row } from 'antd';

import LogoQuick from './../../../assets/images/logo-quick.svg';
import LogoQuickFooter from './../../../assets/images/logo-quick-footer.png';
import LogoFacebook from './../../../assets/images/facebook-icon-footer.png';
import LogoTwitter from './../../../assets/images/twitter-icon-footer.png';
import LogoIg from './../../../assets/images/ig-icon-footer.png';
import LogoYoutube from './../../../assets/images/youtube-icon-footer.svg';
import { SearchBar } from '../common/SearchBar';

import { SCREENFOOTER } from '../../router/CONSTANTS';

const { Header, Content, Footer, Sider } = Layout;

interface props {
    userLocal: any;
    toSigninPage: () => void;
    toSignupPage: () => void;
    logoutApp: () => void;
    selectMenuItem: (value: any) => void;
    chosenItem: string[];
    children?: string | JSX.Element | JSX.Element[];
}

const footerHeadContent = [
    {
        title: '有料会員登録',
        url: '/',
    },
    {
        title: '無料会員登録',
        url: '/',
    },
    {
        title: 'ログイン',
        url: '/',
    },
    {
        title: '使い方',
        url: '/',
    },
];

const SocialMediaList = [
    {
        img: LogoFacebook,
        url: '/',
    },
    {
        img: LogoTwitter,
        url: '/',
    },
    {
        img: LogoIg,
        url: '/',
    },
    {
        img: LogoYoutube,
        url: '/',
    },
];

export const MenuHeaderView = ({ children }: props) => {
    return (
        <Layout style={{minWidth: '500px' }}>
            <Header className="p-header">
                <div id="p-header-inner-quick">
                    <div id="logo-area-quick">
                        <img
                            style={{
                                height: '100%',
                                width: '40%',
                            }}
                            src={LogoQuick}
                            alt="Logo-Quick"
                        />
                        <h1 style={{ lineHeight: 'normal' }} id="content-quick">
                            個人投資の未来を共創する <br />
                            QUICKの金融情報プラットフォーム
                        </h1>
                    </div>
                    <div id="p-header-tools">
                        <SearchBar width={550} height={35} />
                    </div>
                    <div id="p-header-btns">
                        <div className="btn btn-danger">無料会員登録</div>
                        <div className="btn btn-primary">ログイン</div>
                        <div className="btn" style={{ color: 'white' }}>
                            使い方
                        </div>
                    </div>
                </div>
            </Header>
            <Layout style={{width:'95%', padding:'30px 0px 30px 0px'}}>
                <Content style={{ backgroundColor: '#ffffff'}}>
                    {children}
                </Content>
                <Sider 
                    style={{ 
                        paddingTop: '80px',
                        backgroundColor: 'RGB(232, 233, 220)'
                    }}
                     width={300} 
                >
                    <div>
                        side
                    </div>
                </Sider>
            </Layout>
            <Footer id="menu-footer">
                <div id='body-footer'>
                    <div id="footer-head">
                        <div style={{width: '55%'}}>
                            <img
                                style={{
                                    width: '15rem',
                                    height: '2em',
                                }}
                                src={LogoQuickFooter}
                                alt="Logo-Quick"
                            />
                        </div>
                        
                        <div style={{width: '45%', display:'flex', justifyContent: 'flex-end'}}>
                            <div style={{width: '400px'}} >
                                <List
                                    grid={{ gutter: 16, column: 4 }}
                                    dataSource={footerHeadContent}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <a
                                                href={item.url}
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'black',
                                                }}
                                            >
                                                {item.title}
                                            </a>
                                        </List.Item>
                                    )}
                                />
                            </div>
                            <div style={{width: '150px'}}>
                                <List
                                    grid={{ gutter: 16, column: 4 }}
                                    dataSource={SocialMediaList}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <a
                                                href={item.url}
                                                style={{
                                                    fontSize: '14px',
                                                    color: 'black',
                                                    padding: '0x 3px'
                                                }}
                                            >
                                                <img
                                                    src={item.img}
                                                    alt=""
                                                    style={{
                                                        width: '34px',
                                                        height: '34px',
                                                    }}
                                                />
                                            </a>
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div id='footer-list-screem'>
                        <Row gutter={[20,5]} 
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                        {
                            SCREENFOOTER.map((item, index) => {
                                return (
                                    <Col span={4} key={index}>
                                        <List
                                            grid={{ gutter: 16, column: 1 }}
                                            dataSource={item.listscreen}
                                            style={{width: '260px', marginRight: '10px'}}
                                            renderItem={(item) => (
                                                <List.Item 
                                                    style={{height:'17px'}}
                                                >
                                                    {
                                                        item.weight ? 
                                                            <a
                                                            href={item.url}
                                                            style={{
                                                                fontSize: '16px',
                                                                color: 'black',
                                                                fontWeight: item.weight
                                                            }}
                                                            >
                                                                {item.title}
                                                            </a>
                                                        : 
                                                            <a
                                                            href={item.url}
                                                            style={{
                                                                fontSize: '13px',
                                                                color: 'black',
                                                            }}
                                                            >
                                                                {item.title}
                                                            </a>
                                                    }
                                                    
                                            </List.Item>
                                        )}
                                        />
                                    </Col>
                                )
                            })
                        }
                        </Row>
                    </div>
                    <div id='footer-intro'>
                        <p style={{
                            fontSize:'16px',
                            fontWeight: 'bold'
                        }}>
                            ご注意事項
                        </p>
                        <p
                            style={{
                                fontSize:'14px',
                                fontFamily: 'Noto Sans JP, sans-serif',
                            }}
                        >
                            QUICK Money World（クイックマネーワールド）（以下「当サイト」といいます。）は、日本経済新聞社グループの株式会社QUICK（以下「QUICK」といいます。）が運営するサイトです。当サイトに含まれる情報（以下「本情報」といいます。）のうち著作権などの権利性を有するものに関する一切の権利、表示する画面に係わる著作権、ならびに使用される商号および商標に関する権利は、QUICKまたは当該本情報の提供元（以下「情報源」といいます。）に帰属します。本情報は、利用者ご自身でのみご覧いただくものであり、本情報についての蓄積・編集・加工・二次利用（第三者への提供など）、および、本情報を閲覧している端末機以外への転載・組み込みを禁じます。本情報のうち株価情報は（株）日本取引所グループから提供を受けています。株価情報は発生から20分以上遅れて表示しています。本情報のうち日経平均株価の著作権は、（株）日本経済新聞社に帰属します。指数・為替レート・その他のマーケット情報については、東京証券取引所、名古屋証券取引所、CME Group Inc.、東京商品取引所、堂島取引所等各情報源から提供を受けています。CME Group Inc.の情報を閲覧する方はこちらの追加同意事項に同意したものと見なします。当サイトに関する所有権および知的財産権はすべてQUICKまたはQUICKにライセンスを許諾している者に帰属しており、利用者はいかなる理由によってもQUICKまたはQUICKにライセンスを許諾している者の知的財産権を侵害するおそれのある行為（逆アセンブル、逆コンパイル、リバースエンジニアリングを含みますが、これに限定されません）を禁じます。本情報は、特定の銘柄などについての投資勧誘を目的としたものではなく、投資判断の最終決定は、利用者ご自身の責任と判断において行ってください。本情報の内容については信頼できると思われる各種情報、データに基づいて万全を期して作成されていますが、その内容を保証するものではなく、本情報によって生じたいかなる損害についても、その原因の如何を問わず、QUICK及び情報源は 一切責任を負いません。本情報の正確性および信頼性を確認することは、QUICK及び情報源の債務には含まれておりません。通信機器、通信回線、商用ネットワーク、コンピュータなどの障害によって生じた本情報の伝達遅延ならびに本情報の内容の誤謬および欠陥については、QUICK及び情報源は一切責任を負いません。本情報の提供は、技術的不可避な理由によって伝達の遅延や中断が生じる場合があります。なお、当サイトは予告なしに内容が変更または廃止される場合があります。
                        </p>
                    </div>
                </div>
            </Footer>
        </Layout>
    );
};
