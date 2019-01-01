import styles from './inputPwd.css';
import classNames from 'classnames';
// import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Col, Row } from 'antd';
import React from 'react';

const FormItem = Form.Item;

class InputForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

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
                    len: 6,
                    message: '密码必须为6位数'
                  }
                ],
              })(<Input size="large" type="password" />)}
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
