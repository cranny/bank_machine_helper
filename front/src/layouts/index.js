import styles from './index.css';
import { Layout, Divider } from 'antd';

const { Header } = Layout;

function BasicLayout(props) {
  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div className={styles.logo} />
        {/* <Breadcrumb className={styles.nav}>
          <Breadcrumb.Item>
            <a href="">
              <Icon style={{ fontSize: '36px' }} type="home" />
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>遵义长征村镇银行</Breadcrumb.Item>
        </Breadcrumb> */}
      </Header>

      <Divider />

      <div className={styles.content}>{props.children}</div>
    </Layout>
  );
}

export default BasicLayout;
