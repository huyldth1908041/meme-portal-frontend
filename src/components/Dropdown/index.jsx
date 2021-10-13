import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default function DropdownMenu() {
  const menu = (
    <Menu>
      <Menu.Item>
        <a target='_blank' rel='noopener noreferrer' href='https://www.antgroup.com'>
          1st menu item
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu}>
      <a href='/' target='_blank' className='ant-dropdown-link' onClick={(e) => e.preventDefault()}>
        Category <DownOutlined />
      </a>
    </Dropdown>
  );
}
