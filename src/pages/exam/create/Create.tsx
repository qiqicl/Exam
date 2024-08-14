import React, {useRef, useState, useEffect } from 'react';
import style from './create.module.scss'
import type { ProFormInstance } from '@ant-design/pro-components';
import { userListApi, classifyApi,examBanApi,examListApi } from '../../../services/index'
import {
  ProCard,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-components';
import { matchResponse, match2Response,examListResponse } from '../../../types/api/index'
import { message } from 'antd';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { DataType } from '../../../types/api'

const columns: TableColumnsType<DataType> = [
  {
    title: '试卷名称',
    dataIndex: 'name',
    render: (text: string) => <a>{text}</a>,
  },
  {
    title: '科目分类',
    dataIndex: 'class',
  },
  {
    title: '试卷创建人',
    dataIndex: 'creator',
  },
  {
    title: '试卷创建时间',
    dataIndex: 'createTime',
  }
];


const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
};


const Create: React.FC = () => {

  const [classBan, setClassBan] = useState([]);
  const [classify, setClassify] = useState([]);
  const [examiner, setExaminer] = useState([]);
  const [examList, setExamList] = useState([]);
  //步骤二中的筛选出来的数组
  const [list,setList] = useState([])

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time)
    })
  };
  const [selectionType, setSelectionType] = useState<'radio'>('radio');
  // 处理表单
  const formRef = useRef<ProFormInstance>()
  const [formData, setFormData] = useState({})

  const [filterItem,setFilterItem] = useState('')

  const handelForm = async(values:any) => {
    const { name, dateTime, 'Info1[type]': subjectType,'Info2[type]': examinerType,'Info3[type]': classType, ...rest }= values
    // 保存表单数据到状态
    setFormData({
      name,
      dateTime,
      subjectType,
      examinerType,
      classType,
      ...rest,
    })
    await waitTime(2000)
    setFilterItem(values.Info1)
    const filter = Array.of(values.Info1)
    console.log(examList,filterItem1);
    const match:matchResponse[] = examList.filter(examItem => {
      return filter.some(filterItemType => examItem.classify === filterItemType.type)
    })
    //根据科目分类筛选得到的数组
    console.log(match)
    const match2:match2Response[] = match.map(item => {
      return{
        key: item._id,
        name: item.name || '默认名称', // 如果 name 可能不存在，提供默认值
        class: item.classify || '默认班级', 
        creator: item.creator || '默认创建者',
        createTime: item.createTime || '默认创建时间'
      }
  })
  // setMath1(match2)
  console.log(match2)
  setList(match2)
    return true
  }
  // 将filterItem转成数组
  const filterItem1 = Array.of(filterItem)
  console.log(filterItem1)



  useEffect(() => {
    // 调用 监控人 接口并处理返回的数据 
    const getExaminer = async () => {
      try {
        const res = await userListApi()
        const examiner1 = res.data.data.list.map(item => item.username)
        setExaminer(examiner1)
      } catch (error) {
        console.log(error)
      }
    }
    getExaminer()

    // 调用 科目分类 接口并处理返回的数据 
    const getClassify = async () => {
      try {
        const res = await classifyApi()
        const classify1 = res.data.data.list.map(item => item.name)
        // 数组数据去重
        let list = new Set(classify1)
        // 伪数组变成新数组
        list = [...list]
        setClassify(list)
      } catch (error) {
        console.log(error)
      }
    }
    getClassify()
    // 调用 考试班级 接口并处理返回的数据 
    const getClassBanify = async () => {
      try {
        const res = await examBanApi()
        const classBan1 = res.data.data.list.map(item => item.name)
        // 数组数据去重
        let list = new Set(classBan1)
        // 伪数组变成新数组
        list = [...list]
        setClassBan(list)
      } catch (error) {
        console.log(error)
      }
    }
    getClassBanify()
    // 根据科目类型(classify) 调用接口 匹配试卷
    const getTest = async () => {
      try {
        const res = await examListApi()
        const examList1 = res.data.data.list
        setExamList(examList1)
      } catch (error) {
        console.log(error)
      }
    }
    getTest()
  },[])


  return (
    <div className={style.wrap}>
      <div className={style.head}>创建考试</div>
      <div className={style.content}>
      <ProCard>
      <StepsForm<{
        name: string;
      }>
        formRef={formRef}
        onFinish={async () => {
          await waitTime(1000);
          message.success('提交成功');
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
      >
    
        {/* 第一步 */}

        <StepsForm.StepForm<{
          name: string;
        }>
          name="base"
          title="考试基本信息"
          onFinish={handelForm}
        >
          <ProFormText
            name="name"
            label="考试名称"
            width="md"
            placeholder="请输入名称"
            rules={[{ required: true }]}
          />
          <ProFormDateRangePicker name="dateTime" label="考试时间" />
          <ProFormSelect
            label="科目分类"
            name={['Info1', 'type']}
            rules={[{ required: true }]}
            options={classify.map((item) => ({ value: item, label: item}))}
          />
          <ProFormSelect
            label="监考人"
            name={['Info2', 'type']}
            rules={[{ required: true }]}
            options={examiner.map((item) => ({ value: item, label: item}))}
          />
          <ProFormSelect
            label="考试班级"
            name={['Info3', 'type']}
            rules={[{ required: true }]}
            options={classBan.map((item) => ({ value: item, label: item}))}
          />

        </StepsForm.StepForm>

        {/* 第二步 */}

        <StepsForm.StepForm<{
          checkbox: string;
        }>
          name="checkbox"
          title="配置试卷"
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            return true;
          }}
        >
        <Table
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={list}
        />
        </StepsForm.StepForm>

        {/* 第三步 */}
        <StepsForm.StepForm
          name="time"
          title="发布考试"
        >
          <h2>配置信息</h2>
          <p>考试名称：{formData?.name}</p>
          <p>科目分类：{formData?.Info1?.type}</p>
          <p>监考人员：{formData?.Info2?.type}</p>
          <p>班级：{formData?.Info3?.type}</p>
          {/* <p className={style.time}>考试时间：{formData?.dateTime}</p> */}
          <div className={style.time}>
          {formData?.dateTime && formData.dateTime.map((item, index) => (
            // 每个日期项显示在一个新的段落中
            <p key={index}>考试时间 {index + 1}: {item}</p>
          ))}
          </div>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>

      </div>
    </div>
  );
};

export default Create;