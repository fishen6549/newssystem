import React, { useEffect, useState, useContext, useRef } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch, Form, Input } from 'antd'
import { EditOutlined, DeleteOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import axios from 'axios';

const { confirm } = Modal;

export default function NewsCategory() {

  const [rightList, setCategoryList] = useState([])
  const getCategoryList = () => {
    axios.get("/categories").then(res => {
      setCategoryList(res.data);
    })
  }

  useEffect(() => {
    getCategoryList();
  }, [])


  const handleSave = (record) => {
    console.log("handleSave record", record);

    axios.patch(`/categories/${record.id}`, {
      title: record.title,
      value: record.title
    }).then(res => {
      getCategoryList();
    })
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record, editable: true, dataIndex: 'title', title: "栏目名称", handleSave: handleSave
      })
    },
    {
      title: '操作',
      render: (key) => <div>
        < Button danger onClick={() => showDeleteConfirm(key)
        } shape='circle' icon={< DeleteOutlined />} ></Button >
      </div >
    },
  ];

  const showDeleteConfirm = (item) => {
    confirm({
      title: '确定删除吗?',
      icon: <ExclamationCircleFilled />,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const deleteMethod = (item) => {
    // console.log("delete", item);
    if (item.grade === 1) {
      axios.delete(`/categories/${item.id}`).then(res => {
        console.log(res);
        getCategoryList();
      })
    } else {
      deleteChildrenMethod(item);
    }
  }
  // 删除children权限
  const deleteChildrenMethod = (item) => {
    axios.delete(`http://localhost:5000/children/${item.id}`).then(res => {
      console.log(res);
      getCategoryList();
    })
  }

  const EditableContext = React.createContext(null);

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };


  return (
    <div>
      <Table components={
        {
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }
      } dataSource={rightList} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 20 }} />

    </div>
  )
}
