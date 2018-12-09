import styles from './changePwd.css';
import classNames from 'classnames';
// import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Col, Row } from 'antd';
import React from 'react';

const FormItem = Form.Item;

class InputForm extends React.Component {
  state = {
    confirmDirty: false
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        router.push('/newCard/done')
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('2次密码必须一致!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    // const formItemLayout = {
    //   labelCol: {
    //     span: 6,
    //   },
    //   wrapperCol: {
    //     span: 18,
    //   },
    // };

    const singleFormItemLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    };

    return (
      <Form onSubmit={this.handleSubmit} className="input-form">
        <Row>
          <Col span={24}>
            <FormItem label="密码" {...singleFormItemLayout}>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的密码!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                  {
                    len: 6,
                    message: '密码必须为6位数'
                  }
                ],
              })(<Input size="large" type="password" />)}
            </FormItem>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <FormItem label="确认密码" {...singleFormItemLayout}>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: '请确认您的密码!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                  {
                    len: 6,
                    message: '密码必须为6位数'
                  }
                ],
              })(<Input size="large" type="password" onBlur={this.handleConfirmBlur} />)}
            </FormItem>
          </Col>
        </Row>

        <div className={styles.submit}>
          <FormItem>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              className={classNames(styles.button, 'wb-button')}
            >
              确认
            </Button>
          </FormItem>
        </div>
      </Form>
    );
  }
}

const WrappedInputForm = Form.create()(InputForm);

export default function() {
  return (
    <div className={styles.input}>
      <WrappedInputForm />
    </div>
  );
}
