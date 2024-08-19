import React, { useEffect, useRef, useState } from 'react';
import style from './record.module.scss'
import { examRecordApi, classifyListApi,classListApi1 } from '../../../services/index'
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Space, message } from 'antd';
import { listResponse, listType, examPaperQuestionType, chaxun } from '../../../types/api'
import { deleteExamPaperApi, lookExamPaperApi } from '../../../services/index'
import { statusText } from './constants'
import { jsPDF } from "jspdf"
import domtoimage from 'dom-to-image'
import { PlusOutlined } from '@ant-design/icons';
import { classifyType } from '../../../types/api/classAndStudent';


const Record: React.FC = () => {
  const [fouceUpdate, setfouceUpdate] = useState(0)
  const [examPaperFlag, setExamPaperFlag] = useState(false)
  const [examPaperList, setExamPaperList] = useState<listResponse>()
  const [optionLetter] = useState(['A', 'B', 'C', 'D'])
  const domRef = useRef<HTMLDivElement>({} as HTMLDivElement)
  const [classify, setClassify] = useState<classifyType[]>([]);
  const [classBan, setClassBan] = useState<classifyType[]>([])
  //强制更新
  const fouceUpd = () => {
    setfouceUpdate(fouceUpdate + 1)
  }
  //显示关闭预览页面
  const examPaperCome = () => {
    setExamPaperFlag(!examPaperFlag)
  }
  //预览试卷页面关闭
  const examPaperNo = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      examPaperCome()
    }
  }
  //预览试卷
  const lookExamPaper = async (id: string) => {
    const res = await lookExamPaperApi(id)
    setExamPaperList(res.data.data)
    // console.log(res.data.data);
  }
  console.log(examPaperList);
  //删除考试记录
  const deleteExamPaper = async (id: string) => {
    const res = await deleteExamPaperApi(id)
    if (res.data.code === 200) {
      message.success('删除成功')
      fouceUpd()
    } else {
      message.error(res.data.msg)
    }
  }
  const actionRef = useRef<ActionType>();
  // 横竖实现横滚
  const scroll = {
    y:380,
    x:"1500px"
  }
  const resetStatus = {
    '已结束':'已结束',
    '未完成':'未完成',
    '进行中':'进行中'
  }
  
  useEffect(() => {
    // 调用 科目分类 接口并处理返回的数据 
    const getClassify = async () => {
      try {
        const res = await classifyListApi()
        setClassify(res.data.data.list)
      } catch (error) {
        console.log(error)
      }
    }
    console.log(classify)
    getClassify()
    // 调用 考试班级 接口并处理返回的数据 
    const getClassBanify = async () => {
      try {
        const res = await classListApi1()
        setClassBan(res.data.data.list)
        // console.log(classBan)
      } catch (error) {
        console.log(error)
      }
    }
    getClassBanify()
  },[])
    // 将选项数组转换为 filters 所需的格式
    const resetClassify = classify.reduce((prev: any,{name}: any) => {
      prev[name] = name
      return prev;
    }, {})

  // 将选项数组转换为 filters 所需的格式
  const resetClassBan = classBan.reduce((prev: any,{name}: any) => {
    prev[name] = name
    return prev;
  }, {})
  // 导出PDF
  const exportPDF = async (title: string, ref: HTMLDivElement) => {
    // 根据dpi放大，防止图片模糊
    const scale = 4;
    // 下载尺寸 a4 纸 比例
    const pdf = new jsPDF('p', 'pt', 'a4');
    let width = ref.offsetWidth;
    let height = ref.offsetHeight;

    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;
    const contentWidth = canvas.width;
    const contentHeight = canvas.height;

    // 一页pdf显示html页面生成的canvas高度;
    const pageHeight = contentWidth / 592.28 * 841.89;
    // 未生成pdf的html页面高度
    let leftHeight = contentHeight;
    // 页面偏移
    let position = 0;
    // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    const imgWidth = 575.28;
    const imgHeight = 572.28 / contentWidth * contentHeight;

    // 使用 dom-to-image-more 生成图片
    const imgDataUrl = await domtoimage.toPng(ref, {
      width: width * scale,
      height: height * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        // 确保内容不被遮盖
        position: 'absolute',
        left: '0',
        top: '0',
        margin: '0'
      }
    });

    if (height > 14400) { // 超出jspdf高度限制时
      const ratio = 14400 / height;
      width *= ratio;
    }

    // 缩放为 a4 大小  pdf.internal.pageSize 获取当前pdf设定的宽高
    const pdfWidth = pdf.internal.pageSize.getWidth();
    height = height * pdfWidth / width;
    width = pdfWidth;
    if (leftHeight < pageHeight) {
      pdf.addImage(imgDataUrl, 'png', 0, 0, imgWidth, imgHeight);
    } else {    // 分页
      while (leftHeight > 0) {
        pdf.addImage(imgDataUrl, 'png', 0, position, imgWidth, imgHeight);
        leftHeight -= pageHeight;
        position -= 841.89;
        // 避免添加空白页
        if (leftHeight > 0) {
          pdf.addPage();
        }
      }
    }
    // 导出下载
    await pdf.save(`${title}.pdf`);
  }
  // 每行数据渲染
  const columns: ProColumns<listResponse>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '考试名称',
      dataIndex: 'name',
      onFilter: (value, record) => record.name === value,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      disable: true,
      title: '科目分类',
      dataIndex: 'classify',
      filters: true,
      ellipsis: true,
      onFilter: (value, record) => record.classify === value,
      valueType: 'select',
      valueEnum: resetClassify,
    },
    {
      title: '创建者',
      dataIndex: 'creator',
      onFilter: (value, record) => record.creator === value,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      onFilter: (value, record) => record.createTime === value,
    },
    {
      disable: true,
      title: '状态',
      dataIndex: 'status',
      filters: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetStatus,
      onFilter: (value, record) => record.status === value,
      // 将 返回的数据 1 转成已完成  用枚举实现
      render: (_status, record) => {
        return statusText[record.status as number]?.val
      },
    },
    {
      title: '监考人',
      dataIndex: 'examiner',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          }
        ],
      },
      render:(text, record, index) => {
        const examiners = Array.isArray(text) ? text : [];
        return (
          <Space>
             {examiners.map((examiner, examinerIndex) => (
              <p key={examinerIndex}>{examiner}</p>
             ))}
          </Space>
        )
      }
    },
    {
      disable: true,
      title: '考试班级',
      dataIndex: 'group',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: resetClassBan
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
    },
    {
      title: '设置',
      valueType: 'option',
      key: 'option',
      render: (_text, record, _action) => [
        <a
          key="editable"
          onClick={() => {
            examPaperCome()
            lookExamPaper(record.examId as string)
          }}
        >
          预览试卷
        </a>,
        <a
          rel="noopener noreferrer"
          key="view"
          onClick={() => {
            deleteExamPaper(record._id)
          }}
        >
          删除
        </a>
      ],
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      disable: true,
      render: (_text, _record, _action) => [
        <Button
          key="editable"
        >
          成绩分析
        </Button>
      ],
    },
  ];

  return (
    <div className={style.wrap} key={fouceUpdate}>
      <div className={style.head}>考试记录</div>
      <div className={style.table}>
        <ProTable<listResponse>
          scroll={scroll}
          columns={columns}
          actionRef={actionRef}
          cardBordered
          rowKey='_id'
          request = {async (params:chaxun) => {
            // console.log(params)// 获取输入框的内容
            const res = await examRecordApi({
              classify: params.classify,
              creator:params.creator,
              endTime: params.endTime,
              examiner:params.examiner,
              group: params.group,
              name:params.name,
              showTime:params.showTime,
              startTime:params.startTime,
              status:params.status,
            })
            const list = structuredClone(res.data.data.list)
            list.forEach((item: listType) => {
              item.startTime = new Date(item.startTime).toLocaleString() || ''
              item.createTime = new Date(item.createTime).toLocaleString() || ''
              item.endTime = new Date(item.endTime).toLocaleString() || ''
            })

            return Promise.resolve({
              data: list,
              success: true,
            })
          }}
          editable={{
            type: 'multiple'
          }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
            defaultValue: {
              option: { fixed: 'right', disable: true }
            },
            onChange(value) {
              console.log('value: ', value);
            }
          }}
          search={{
            labelWidth: 'auto'
          }}
          options={{
            setting: {
              listsHeight: 400
            },
          }}
          form={{
            // 由于配置了 transform，提交的参数与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return {
                  ...values,
                  created_at: [values.startTime, values.endTime],
                };
              }
              return values;
            },
          }}
          pagination={{
            pageSizeOptions: [5, 10, 20, 50],
          }}
          dateFormatter="string"
          headerTitle="考试记录"
          toolBarRender={() => [
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => {
                actionRef.current?.reload();
              }}
              type="primary"
            >
              新建
            </Button>,
          ]}
        />
      </div>
      {examPaperFlag ?
        <div className={style.examPaperView} onClick={examPaperNo}>
          <div className={style.examPaperViewCon}>
            <div className={style.header}>
              <Space>
                <span className={style.close} onClick={examPaperCome}>×</span>
                <h2>试卷预览</h2>
              </Space>
              <div className={style.confirmBtn}>
                <Space>
                  <Button
                    key="button"
                    onClick={() => exportPDF('试卷', domRef.current)}
                    type="default"
                  >
                    导出PDF
                  </Button>
                  <Button
                    key="button"
                    onClick={examPaperCome}
                    type="primary"
                  >
                    确定
                  </Button>
                </Space>
              </div>
            </div>
            <div ref={domRef} style={{ padding: 20 }}>
              <div className={style.tit}>
                <h1>{examPaperList?.name}</h1>
                <h3>考试科目：{examPaperList?.classify}</h3>
              </div>
              {(examPaperList?.questions?.every((item: examPaperQuestionType) => item === null)) ? '' :
                <div>
                  {(examPaperList?.questions?.find((item: examPaperQuestionType) => item?.type === '1')) ?
                    <div className={style.selecting}>
                      <h4 style={{color: '#1890FF'}}>单选题</h4>
                      <ul>
                        {examPaperList?.questions?.filter((item: examPaperQuestionType) => item?.type === '1').map((every: examPaperQuestionType, index: number) => {
                          return <li>
                            <p>{index + 1}. {every.answer}</p>
                            {every.options.map((v, i) => {
                              return <span>{optionLetter[i]}. {v}</span>
                            })}
                          </li>
                        })}
                      </ul>
                    </div> : ''}

                  {(examPaperList?.questions?.find((item: examPaperQuestionType) => item?.type === '2')) ?
                    <div className={style.moreSelecting}>
                      <h4 style={{color: '#1890FF'}}>多选题</h4>
                      <ul>
                        {examPaperList?.questions?.filter((item: examPaperQuestionType) => item?.type === '2').map((every: examPaperQuestionType, index: number) => {
                          return <li>
                            <p>{index + 1}. {every.answer}</p>
                            {every.options.map((v, i) => {
                              return <span>{optionLetter[i]}. {v}</span>
                            })}
                          </li>
                        })}
                      </ul>
                    </div> : ''}
                </div>
              }
            </div>
          </div>
        </div>
        : ''}
    </div>
  )
}

export default Record;