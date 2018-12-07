import styles from './done.css';
import classNames from 'classnames';
// import Link from 'umi/link';
// import router from 'umi/router';
import React from 'react';
import { Form, Button, Checkbox } from 'antd';

const FormItem = Form.Item;

class InputForm extends React.Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        // router.push('/newCard/changePwd');
      }
    });
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

    // const singleFormItemLayout = {
    //   labelCol: {
    //     span: 3,
    //   },
    //   wrapperCol: {
    //     span: 21,
    //   },
    // };

    return (
      <Form onSubmit={this.handleSubmit} className="input-form">
        <h1>借记开卡成功(一类户)</h1>
        <p>请勾选需要联动的交易</p>
        <div>
          <FormItem>
            {getFieldDecorator('addInfo', {
              valuePropName: 'checked',
            })(<Checkbox>客户信息补录</Checkbox>)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('smsSign', {
              valuePropName: 'checked',
            })(<Checkbox>短信签约</Checkbox>)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('transferSign', {
              valuePropName: 'checked',
            })(<Checkbox>转账签约</Checkbox>)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('fastSign', {
              valuePropName: 'checked',
            })(<Checkbox>小额免密签约</Checkbox>)}
          </FormItem>

          <FormItem>
            {getFieldDecorator('onlineSign', {
              valuePropName: 'checked',
            })(<Checkbox>网银签约</Checkbox>)}
          </FormItem>
        </div>

        <div className={styles.submit}>
          <FormItem>
            <Button
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
