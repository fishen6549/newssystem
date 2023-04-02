import React, { useState } from 'react'
import { Layout, Dropdown, Space, Avatar } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

const { Header } = Layout;
function TopHeader(props) {


  // console.log("TopHeader", props);


  const [collapsed, setcollapsed] = useState(false);
  const navigate = useNavigate();

  const { username, role: { roleName } } = JSON.parse(localStorage.getItem("token"));

  const changeCollapsed = () => {
    // setcollapsed(!collapsed);
    // console.log("changeCollapsed", props);
    props.changeCollapsed();
  }

  const onClick = ({ key }) => {
    if (key === "2") {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const items = [
    {
      key: '1',
      label: roleName,
    },

    {
      key: '2',
      danger: true,
      label: '退出',
    },
  ];
  return (

    <Header
      style={{
        padding: "0 16px",
        background: "white",
      }}
    >
      {/* {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => setCollapsed(!collapsed),
      })} */}

      {
        // collapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }

      <div style={{ float: "right" }}>
        <span>欢迎<span style={{ color: "#1890ff" }}>{username}</span>回来</span>
        <Dropdown
          menu={{
            items, onClick
          }}
        >
          <Avatar icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps = (state) => {
  // console.log("state", state);
  return {
    isCollapsed: state.CollapsedReducer.isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: "change_collapsed"
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader)