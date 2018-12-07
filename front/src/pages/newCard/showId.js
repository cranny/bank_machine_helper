import styles from './showId.css';
// import { Button } from 'antd';
import classNames from 'classnames';
import Link from 'umi/link';

export default function() {
  return (
    <div className={styles.home}>
      <div className={styles.idBox} />
      <Link to="/newCard/input" className={classNames(styles.button, 'wb-button')}>
        下一步
      </Link>
    </div>
  );
}
