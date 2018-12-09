import styles from './loading.scss';
// import { Button } from 'antd';
import classNames from 'classnames';

export default function(props) {
  return (
    <div className={classNames(styles.loading, props.text ? '' : 'hide')}>
      <div className={styles.inner}>
        <div className={styles.left}><div className={styles.whirl}></div></div>
        <p className={styles.text}>{props.text}</p>
      </div>
    </div>
  );
}
