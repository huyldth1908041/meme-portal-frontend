import React from 'react';
import { Layout, List, Card, Checkbox } from 'antd';

const TokenShop = () => {
  const data = [
    {
      title: 'Title 1',
      price: 1000,
    },
    {
      title: 'Title 2',
      price: 1000,
    },
    {
      title: 'Title 3',
      price: 1000,
    },
    {
      title: 'Title 4',
      price: 1000,
    },
  ];
  const { Content, Sider } = Layout;
  const { Meta } = Card;
  const options = [
    { label: 'Apple', value: 'Apple1' },
    { label: 'Pear', value: 'Pear1' },
    { label: 'Orange', value: 'Orange111' },
  ];
  const onChange = (e) => {
    console.log(`checked = ${e}`);
  };
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider>
        {options.map((checkbox, key) => (
          <Checkbox style={{ color: 'white', margin: '10px' }} onChange={onChange} key={key} value={checkbox.value}>
            {checkbox.label}
          </Checkbox>
        ))}
      </Sider>
      <Layout className='site-layout'>
        <Content style={{ margin: '30px' }}>
          <List
            grid={{ gutter: 4, column: 4 }}
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  style={{ width: 240 }}
                  cover={<img alt='example' src='https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' />}
                >
                  <Meta title={`$${item.price}`} description='Active in 1 weeks' />
                </Card>
              </List.Item>
            )}
          />
        </Content>
      </Layout>
    </Layout>
  );
};

export default TokenShop;
