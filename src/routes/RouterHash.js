/**
 * Created by dongc_000 on 2018/4/29.
 */

const router={
  '2':'/admin',
  '3':'/salesman',
  '4':'/buyer',
  '5':'/warehouseKeeper',
  '6':'/producer',
  '7':'/accountant'
};

export function getPath(role) {
  return router[role];
}
