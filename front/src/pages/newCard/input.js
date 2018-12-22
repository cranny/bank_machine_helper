import styles from './input.css';
import classNames from 'classnames';
// import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Col, Row } from 'antd';
import React from 'react';
import { connect } from 'dva'

const FormItem = Form.Item;

class InputForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        router.push('/newCard/changePwd')
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 20,
      },
    };

    const singleFormItemLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };

    const extraData = {
      taxIdentity: '(1) 仅为中国税收居民'
    }

    return (
      <Form onSubmit={this.handleSubmit} className="input-form">
        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="姓名" {...formItemLayout}>
              {getFieldDecorator('name', {
                // initialValue: idCardData.name,
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="证件号码" {...formItemLayout}>
              {getFieldDecorator('certCode', {
                // initialValue: idCardData.certCode,
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="性别" {...formItemLayout}>
              {getFieldDecorator('sex', {
                // initialValue: idCardData.sex,
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="发证机关" {...formItemLayout}>
              {getFieldDecorator('issueAgency', {
                // initialValue: idCardData.issueAgency,
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="证件住址" {...singleFormItemLayout}>
              {getFieldDecorator('certAddress', {
                // initialValue: idCardData.certAddress,
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="常住住址" {...singleFormItemLayout}>
              {getFieldDecorator('homeAddress', {
                rules: [{ required: true, message: '常住住址不能为空!' }],
              })(<Input size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="纳税身份" {...singleFormItemLayout}>
              {getFieldDecorator('taxIdentity', {
                initialValue: extraData.taxIdentity,
                rules: [{ required: true, message: '纳税身份不能为空!' }],
              })(<Input disabled size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="移动电话" {...formItemLayout}>
              {getFieldDecorator('mobile_phone', {
                rules: [{ required: true, message: '移动电话不能为空!' }],
              })(<Input size="large" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="电子邮件" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email', message: '您的邮箱地址格式不正确!',
                  }
                ],
              })(<Input size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row gutter={24}>
          <Col span={12}>
            <FormItem label="住宅电话" {...formItemLayout}>
              {getFieldDecorator('telephone', {
                rules: [

                ],
              })(<Input size="large" />)}
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem label="邮政编码" {...formItemLayout}>
              {getFieldDecorator('zipcode', {
                rules: [

                ],
              })(<Input size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="工作单位" {...singleFormItemLayout}>
              {getFieldDecorator('companyName', {
                rules: [],
              })(<Input size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="单位电话" {...singleFormItemLayout}>
              {getFieldDecorator('companyPhone', {
                rules: [],
              })(<Input size="large" />)}
            </FormItem>
          </Col>
        </Row>

        <div className={styles.submit}>
          <FormItem>
            <Button type="primary" size="large" htmlType="submit" className={classNames(styles.button, 'wb-button')}>
              确认
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    ids: state.ids
  };
}

function Page({ids}) {
  const WrappedForm = Form.create({
    mapPropsToFields(props) {
      return Object.keys(ids.info).reduce((res, key) => {
        res[key] = Form.createFormField({
          value: ids.info[key]
        })
        return res;
      }, {});
    }
  })(InputForm)

  return (
    <div className={styles.input}>
      <WrappedForm />
    </div>
  );
}

export default connect(mapStateToProps)(Page);