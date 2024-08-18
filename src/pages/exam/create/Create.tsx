import React, {useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './create.module.scss'
import type { ProFormInstance } from '@ant-design/pro-components';
import { userListApi, classifyListApi, examListApi, classListApi1, createTestApi,examRecordApi } from '../../../services/index'
import {
  ProCard,
  ProFormSelect,
  ProFormText,
  StepsForm,
  ProFormDateTimeRangePicker
} from '@ant-design/pro-components';
import { matchResponse, match2Response, ExamListResponse, formDataType } from '../../../types/api/index'
import { message } from 'antd';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { DataType } from '../../../types/api'
import {classifyType} from '../../../types/api/classAndStudent'

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
]

const Create: React.FC = () => {
  const [classBan, setClassBan] = useState<string[]>([])
  const [classify, setClassify] = useState<string[]>([])
  const [examiner, setExaminer] = useState<string[]>([])
  const [keys, setKeys] = useState<string[]>([])
  const [date, setDate] = useState<string[]>([])
  const navigate = useNavigate()
  const [examList, setExamList] = useState<ExamListResponse["data"]["list"]>([]);
  //步骤二中的筛选出来的数组
  const [list,setList] = useState<match2Response[]>([])
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      console.log(selectedRowKeys)
    // 将 selectedRowKeys 中的每个值转换为字符串
    const stringKeys = selectedRowKeys.map(val => String(val));
    // 更新状态
    setKeys(stringKeys);
    },
    getCheckboxProps: (record: DataType) => ({
      disabled: record.name === 'Disabled User',
      name: record.name,
    }),
  };

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time)
    })
  }
  const [selectionType] = useState<'radio'>('radio');
  // 处理表单
  const formRef = useRef<ProFormInstance>()
  const [formData, setFormData] = useState<formDataType>({} as formDataType)


  const handelForm = async(values:formDataType) => {
    const { name, startTime,endTime, classify,examiner,group, ...rest }= values
    // 保存表单数据到状态
    setFormData({
      name,
      startTime,
      endTime,
      classify,
      examiner,
      group,
      ...rest,
    })
    await waitTime(2000)
    const filter = Array.of(values.classify)
    console.log(filter)
    const match:matchResponse[] = examList.filter(examItem => {
      return filter.some(filterItemType => examItem.classify === filterItemType)
    })
    console.log(match)
    //根据科目分类筛选得到的数组
    const match2:match2Response[] = match.map(item => {
      return{
        key: item._id,
        name: item.name || '默认名称', // 如果 name 可能不存在，提供默认值
        class: item.classify || '默认班级', 
        creator: item.creator || '默认创建者',
        createTime: new Date(item.createTime).toLocaleString() || '默认创建时间'
      }
    })
    setList(match2)
    // 转换
    return true
  }


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
        const res = await classifyListApi()
        const classify1 = res.data.data.list.map(item => item.name)
        // 数组数据去重
        let list = new Set(classify1)
        // 伪数组变成新数组
        // list = [...list]
        let list1= Array.from(list)
        setClassify(list1)
      } catch (error) {
        console.log(error)
      }
    }
    getClassify()
    // 调用 考试班级 接口并处理返回的数据 
    const getClassBanify = async () => {
      try {
        const res = await classListApi1()
       
        const classBan2:classifyType[] = res.data.data.list
        const classBan1 =  classBan2.map(item => item.name)

        // 数组数据去重
        let list = new Set(classBan1)
        // 伪数组变成新数组
        // list = [...list]
        let list1= Array.from(list)
        setClassBan(list1)
        // console.log(classBan)
      } catch (error) {
        console.log(error)
      }
    }
    getClassBanify()
    // 根据科目类型(classify) 调用接口 匹配试卷
    const getTest = async () => {
      try {
        const res = await examListApi()
        const examList1:ExamListResponse["data"]["list"] = res.data.data.list
        setExamList(examList1)
        // console.log(examList)
      } catch (error) {
        console.log(error)
      }
    }
    getTest()
  },[])

  useEffect(() => {
    // 将key的值放进去
    console.log(keys.join('')); // 这将打印最新的 keys 值
    const addKeys = () => {
      // 使用展开运算符 ... 来复制 formData 并更新 keys 属性
      // 确保 formData 和 dateTimeRange 存在
    if (formData && formData.dateTimeRange && formData.dateTimeRange[0] && formData.dateTimeRange[1]) {
      setFormData({
        ...formData,
        examId: keys.join(''),
        startTime:(Date.parse(formData?.dateTimeRange[0])).toString(),
        endTime:(Date.parse(formData?.dateTimeRange[1])).toString()
      })
    }
  }
    addKeys()
  }, [keys,formData?.dateTimeRange]);

  // 转开始时间和结束时间
  const startTime = new Date(formData.startTime).toLocaleString()
  console.log(formData.startTime)
  console.log(new Date(formData.startTime).toLocaleString())
  console.log(formData.startTime)


  console.log(formData)
  console.log(formData.startTime)
  // const 


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
          <ProFormDateTimeRangePicker
            name="dateTimeRange"
            label="考试时间"
            rules={[{ required: true }]}
          />
          <ProFormSelect
            label="科目分类"
            name='classify'
            rules={[{ required: true }]}
            options={classify.map((item) => ({ value: item, label: item}))}
          />
          <ProFormSelect
            label="监考人"
            name='examiner'
            rules={[{ required: true }]}
            options={examiner.map((item) => ({ value: item, label: item}))}
          />
          <ProFormSelect
            label="考试班级"
            name='group'
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
          onFinish={async () => {
            const res = await createTestApi(Date.now(), formData)
            console.log(res)
            navigate('/exam/record')
            return true;
          }}
        >
          <h2>配置信息</h2>
          <p>考试名称：{formData?.name}</p>
          <p>科目分类：{formData?.classify}</p>
          <p>监考人员：{formData?.examiner}</p>
          <p>班级：{formData?.group}</p>
          <p>考试时间: &nbsp;&nbsp;开始时间:{formData.startTime}</p>
          <p className={style.end}>结束时间:{formData.endTime}</p>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
      </div>
    </div>
  );
};

export default Create;