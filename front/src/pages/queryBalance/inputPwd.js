import styles from './inputPwd.css';
import classNames from 'classnames';
// import Link from 'umi/link';
import router from 'umi/router';
import { Form, Input, Button, Col, Row } from 'antd';
import React from 'react';
import { connect } from 'dva';
import { getBankAPI } from '../../lib/hardware';
import CountDown from '../../components/countdown'

const FormItem = Form.Item;

class InputForm extends React.Component {

  hasInputed = false
  timeout = 60

  componentDidMount() {
    const { cardNum } = this.props.card
    getBankAPI().Pinpad.start(cardNum)
    getBankAPI().Pinpad.on('onInput', this.onInput)
  }

  onTimeout = () => {
    router.push('/');
  }

  componentWillUnmount() {
    getBankAPI().Pinpad.off('onInput', this.onInput)
    getBankAPI().Pinpad.pinpadEndRead()
    getBankAPI().Pinpad.close()
  }

  onInput = (num) =>{
    console.log(num)
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  renderWait() {
    return (
      <div className={styles.figure}>
      { !this.hasInputed ? <CountDown text="请于%s内输入您的取款密码" num={this.timeout} onEnd={this.onTimeout} /> : null }
      </div>
    )
  }

  renderForm() {
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
              <Input size="large" type="password" />
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

  render() {
    return (
      <div>
        {this.renderWait()}
        {this.renderForm()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    card: state.card
  };
}

export default connect(mapStateToProps)(InputForm);
