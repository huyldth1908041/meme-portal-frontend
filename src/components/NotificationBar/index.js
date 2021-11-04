import { IoNotificationsOutline } from 'react-icons/all';
import { Dropdown, Menu } from 'antd';
import React from 'react';
import Fire from '../../services/fire';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import NotificationItem from '../NotificationItem';
import styled from 'styled-components';
import { useAuthentication } from '../../hooks';

const StyledMenu = styled(Menu)`
  width: 350px;
`;
const NotificationChip = styled.span`
  display: block;
  position: absolute;
  top: -7px;
  right: -9px;
  z-index: 10;
  font-size: 12px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: red;
  color: #fff;
`;
const ReadAllBtn = styled.div`
  width: 100%;
  text-align: center;
  padding: 10px 0;
  cursor: pointer;
  color: #008EDE;
`;
const NotificationBar = () => {
  const { user } = useAuthentication();
  const notificationRef = Fire.create.fireStore.collection(user.username);
  const query = notificationRef.orderBy('createdAt', 'desc').limit(5);
  const [notifications = []] = useCollectionData(query, { idField: 'id' });
  const activeNotifications = notifications.filter(notification => notification.status > 0);
  const handleNotificationClicked = async (item) => {
    await notificationRef.doc(item.id).update({ ...item, status: -1 });
  };
  const handleMarkAsRead = async () => {
    for (let i = 0; i < activeNotifications.length; i++) {
      const item = activeNotifications[i];
      await notificationRef.doc(item.id).update({ ...item, status: -1 });
    }
  };

  const menu = (
    <StyledMenu>
      {
        notifications && notifications.length > 0 ? notifications.map(item => (
          <Menu.Item key={item.id} onClick={async () => await handleNotificationClicked(item)}>
            <NotificationItem item={item} />
          </Menu.Item>
        )) : (
          <Menu.Item key='no-notification'>
            <p>You dont have any notification yet</p>
          </Menu.Item>
        )
      }
      {
        activeNotifications.length > 0 && (<ReadAllBtn onClick={handleMarkAsRead}>Mark all as read</ReadAllBtn>)
      }
    </StyledMenu>
  );

  return (
    <Dropdown overlay={menu} trigger='click' placement='bottomCenter'>
      <button>
        <IoNotificationsOutline />
        {activeNotifications.length > 0 && <NotificationChip>{activeNotifications.length}</NotificationChip>}
      </button>
    </Dropdown>
  );
};
export default NotificationBar;