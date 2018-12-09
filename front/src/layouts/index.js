import styles from './index.css';
import { Layout, Divider } from 'antd';
import { connect } from 'dva';
import withRouter from 'umi/withRouter';
import Loading from '../components/loading';
import Tool from '../components/tool'

const { Header } = Layout;

function BasicLayout({ app, children}) {
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

      <div className={styles.content}>{children}</div>
      <Loading className={app.loading ? '' : 'hide'} text={app.loading} />
      <Tool show={app.tool} />
      <object className={styles.ocx} title="devControl" classID="clsid:1D2162F4-98C8-417E-8410-C1E9B0B0337C" hspace="0" vspace="0" id="BOCOMDevControl"/>
    </Layout>
  );
}


function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default withRouter(connect(mapStateToProps)(BasicLayout));

