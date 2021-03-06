import { default as React } from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { ACTION_TYPE, EXCHANGE_MODE, IAction, IOperation } from 'stores/interfaces';
import * as styles from './styles.styl';
import cn from 'classnames';
import { dateTimeAgoFormat, truncateAddressString } from 'utils';
import { STEPS_TITLE } from './steps-constants';
import { IColumn, Table } from '../../components/Table';
import { Text } from '../../components/Base';
import { Price } from './Components';
import { useStores } from '../../stores';

export interface IExpandedRowProps {
  data: IOperation;
}

const isEth = type =>
  ['approveEthManger', 'lockToken', 'unlockToken', 'unlockTokenRollback', 'waitingBlockNumber'].includes(type);

const getActionFee = (action: IAction): { isEth: boolean; value: number } => {
  if (!action || !action.payload || !action.payload.gasPrice) {
    return { isEth: false, value: 0 };
  }

  if (isEth(action.type)) {
    const gasLimit = Number(action.payload.gasUsed);
    const gasPrice = Number(action.payload.gasPrice);

    return { isEth: true, value: (gasPrice * gasLimit) / 1e18 };
  } else {
    const gasLimit = Number(action.payload.gasLimit || action.payload.gas);
    const gasPrice = Number(action.payload.gasPrice);

    return { isEth: false, value: (gasPrice * gasLimit) / 1e18 };
  }
};

export const getOperationFee = (operation: IOperation) => {
  const isEth = operation.type === EXCHANGE_MODE.ETH_TO_SCRT;

  const actionsFee = operation.actions.map(getActionFee).filter(a => a.isEth === isEth);

  return actionsFee.reduce((acc, action) => acc + action.value, 0);
};

const renderActionFee = (action: IAction): string => {
  if (!action || !action.payload || !action.payload.gasPrice) {
    return '--';
  }

  const fee = getActionFee(action);

  if (fee.isEth) {
    return fee.value + ' ETH';
  } else {
    return fee.value + ' ONE';
  }
};

export const ExpandedRow = observer((props: IExpandedRowProps) => {
  const { tokens } = useStores();

  const erc20Address = props.data.erc20Address || '';

  const token = tokens.data.find(t => t.src_address.toLowerCase() === erc20Address.toLowerCase());

  return (
    <Box direction="column" pad={{ bottom: 'small' }}>
      {props.data.actions.map(action => (
        <Box direction="column" margin={{ top: 'small' }} key={action.id}>
          <Box
            direction="row"
            align="center"
            justify="end"
            pad={{ left: 'large' }}
            style={
              {
                // paddingBottom: 16,
                // borderBottom: '1px solid rgba(222, 222, 222, 0.4)',
              }
            }
          >
            <Box
              className={cn(styles.actionCell, styles.type, styles.first)}
              style={{ width: 240 }}
              direction="column"
              align="start"
            >
              <Box direction="row" align="center">
                <img
                  src={isEth(action.type) ? '/static/eth.svg' : 'scrt.svg'}
                  style={{
                    marginRight: 15,
                    marginBottom: 2,
                    height: isEth(action.type) ? 20 : 18,
                    width: 'auto',
                  }}
                />
                {STEPS_TITLE[action.type]}
              </Box>
              {action.error ? <Text color="red">{action.error}</Text> : null}
            </Box>

            <Box className={cn(styles.status, styles[action.status])} margin={{ right: '25px' }} style={{ width: 120 }}>
              {action.status}
            </Box>

            {action.type === ACTION_TYPE.getHRC20Address && !!token ? (
              <Box className={styles.actionCell} style={{ width: 220, paddingLeft: 16 }} align="center" direction="row">
                <a
                  className={styles.addressLink}
                  href={process.env.ETH_EXPLORER_URL + '/token/' + token.src_address}
                  target="_blank"
                  rel="noreferrer"
                >
                  {token.symbol}
                </a>
                <span style={{ margin: '0 10px' }}>/</span>
                <a
                  className={styles.addressLink}
                  href={process.env.SCRT_EXPLORER_URL + '/contracts/' + token.dst_address}
                  target="_blank"
                  rel="noreferrer"
                >
                  1{token.symbol}
                </a>
              </Box>
            ) : (
              <Box className={styles.actionCell} style={{ width: 220 }} align="center">
                <a
                  className={styles.addressLink}
                  href={
                    (isEth(action.type)
                      ? process.env.ETH_EXPLORER_URL + '/tx/'
                      : process.env.SCRT_EXPLORER_URL + '/transactions/') + action.transactionHash
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  {truncateAddressString(action.transactionHash, 9)}
                </a>
              </Box>
            )}

            <Box className={styles.actionCell} style={{ width: 160 }}>
              {action.timestamp ? dateTimeAgoFormat(action.timestamp * 1000) : '--'}
            </Box>
            <Box className={styles.actionCell} style={{ width: 180 }}>
              {action.payload ? <Price value={Number(getActionFee(action).value)} isEth={isEth(action.type)} /> : '--'}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
});
