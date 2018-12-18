import styles from './showId.css';
import { Button } from 'antd';
import classNames from 'classnames';
// import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

function Page({ ids }) {
  const onConfirm = () => {
    router.push('/newCard/input')
  }

  return (
    <div className={styles.home}>
      <div className={styles.idBox}>
        <img className={styles.idImage} alt="" src={ids.images.IdsImage1} />


      </div>
      <Button type="primary" size="large" onClick={onConfirm} className={classNames(styles.button, 'wb-button')}>
        确认
      </Button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    ids: state.ids
  };
}

export default connect(mapStateToProps)(Page);
