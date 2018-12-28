import styles from './index.scss';
import { Row, Col } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';

export default function() {
  const gutter = 4;
  return (
    <div className={styles.home}>
      <Row className={styles.row} gutter={gutter} type="flex">
        <Col span={10}>
          <Link to="/newCard/checkId" className={classNames(styles.cardItem, styles.lightBlue)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem1)}>
              自助开卡
            </figure>
          </Link>
        </Col>
        <Col span={9}>
          <Link to="" className={classNames(styles.cardItem, styles.pink)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem2)}>
              转账汇款
            </figure>
          </Link>
        </Col>
        <Col span={5}>
          <Link to="" className={classNames(styles.cardItem, styles.purple)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem3)}>
              密码修改
            </figure>
          </Link>
        </Col>
      </Row>
      <Row className={styles.row} gutter={gutter} type="flex">
        <Col span={6}>
          <Link to="" className={classNames(styles.cardItem, styles.indigo)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem4)}>
              一卡通定转活
            </figure>
          </Link>
        </Col>
        <Col span={9}>
          <Link to="/queryBalance/checkCard" className={classNames(styles.cardItem, styles.blue)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem5)}>
              余额查询
            </figure>
          </Link>
        </Col>
        <Col span={9}>
          <Link to="" className={classNames(styles.cardItem, styles.cyan)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem6)}>
              一卡通活转定
            </figure>
          </Link>
        </Col>
      </Row>
      <Row className={styles.row} gutter={gutter} type="flex">
        <Col span={5}>
          <Link to="" className={classNames(styles.cardItem, styles.lightGreen)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem7)}>
              存折补登
            </figure>
          </Link>
        </Col>
        <Col span={5}>
          <Link to="" className={classNames(styles.cardItem, styles.lime)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem8)}>
              {' '}
              短信签约
            </figure>
          </Link>
        </Col>
        <Col span={9}>
          <Link to="" className={classNames(styles.cardItem, styles.deepPurple)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem9)}>
              卡片激活
            </figure>
          </Link>
        </Col>
        <Col span={5}>
          <Link to="" className={classNames(styles.cardItem, styles.teal)}>
            <figure className={classNames(styles.cardInnerItem, styles.cardInnerItem10)}>
              个人信息修改
            </figure>
          </Link>
        </Col>
      </Row>
    </div>
  );
}
