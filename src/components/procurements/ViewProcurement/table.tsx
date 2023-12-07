import type { NextPage } from "next";
import styles from "./table.module.css";

const ViewProcurementTable: NextPage = () => {
  return (
    <table className={styles.table}>
      <thead>
        <tr className={styles.tr}>
          <th className={styles.th} colSpan={2}>
            <div className={styles.inputField}>
              <div className={styles.label}>Name</div>
            </div>
          </th>
          <th className={styles.th}>
            <div className={styles.inputField1}>
              <div className={styles.label1}>
                <span className={styles.available}>Available</span>
                <span className={styles.qty}>(Qty)</span>
              </div>
            </div>
          </th>
          <th className={styles.th}>
            <div className={styles.inputField1}>
              <div className={styles.label1}>
                <span className={styles.available}>Procurement</span>
                <span className={styles.qty}>(Qty)</span>
              </div>
            </div>
          </th>
          <th className={styles.th} colSpan={3}>
            <div className={styles.inputField3}>
              <div className={styles.label3}>Approved By</div>
            </div>
          </th>
          <th className={styles.th}>
            <div className={styles.inputField4}>
              <div className={styles.label3}>Name OF Vendor</div>
            </div>
          </th>
          <th className={styles.th} colSpan={3}>
            <div className={styles.inputField5}>
              <div className={styles.label3}>Status</div>
            </div>
          </th>
          <th className={styles.th}>
            <div className={styles.inputField3}>
              <div className={styles.label1}>
                <span className={styles.price}>Price</span>
                <span className={styles.qty}>(Rs)</span>
              </div>
            </div>
          </th>
          <th className={styles.th}>
            <div className={styles.inputField7} />
          </th>
          <th className={styles.th8}>
            <div className={styles.inputField8} />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>Ammonium nitrate</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>10 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>02 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>
                Maple Biotech Accord Chem tech
              </div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField14}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15}>
              <div className={styles.dropdownText}>₹20,000</div>
            </div>
          </td>
        </tr>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>Triple superphosphate</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>02 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>01 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>
                Maple Biotech Accord Chem tech
              </div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField14}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15}>
              <div className={styles.dropdownText}>₹20,000</div>
            </div>
          </td>
        </tr>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>{`Potassium chloride `}</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>05 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>03 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>
                Maple Biotech Accord Chem tech
              </div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField14}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15}>
              <div className={styles.dropdownText}>₹20,000</div>
            </div>
          </td>
        </tr>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>Ammonium nitrate</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>50 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>20 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>
                Maple Biotech Accord Chem tech
              </div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField14}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15}>
              <div className={styles.dropdownText}>₹20,000</div>
            </div>
          </td>
        </tr>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>Ammonium nitrate</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>50 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>20 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>--</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField35}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15}>
              <div className={styles.dropdownText}>--</div>
            </div>
          </td>
        </tr>
        <tr className={styles.tr1}>
          <td className={styles.th}>
            <div className={styles.row}>
              <div className={styles.text}>Ammonium nitrate</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField10}>
              <div className={styles.dropdownText}>50 Kgs</div>
            </div>
          </td>
          <td className={styles.th}>
            <div className={styles.inputField11}>
              <div className={styles.dropdownText}>20 Kgs</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField12}>
              <div className={styles.dropdownText2}>Sriram Sir</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField13}>
              <div className={styles.dropdownText2}>--</div>
            </div>
          </td>
          <td className={styles.th} colSpan={2}>
            <div className={styles.inputField35}>
              <div className={styles.button}>
                <div className={styles.shipped}>Shipped</div>
              </div>
            </div>
          </td>
          <td className={styles.th8} colSpan={2}>
            <div className={styles.inputField15} />
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr className={styles.tr1}>
          <td className={styles.td42} colSpan={7}>
            <div className={styles.inputField44}>
              <div className={styles.dropdownText29}>Total Amount</div>
            </div>
          </td>
          <td className={styles.td43} colSpan={2}>
            <div className={styles.inputField45}>
              <div className={styles.dropdownText30}>₹80,000</div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default ViewProcurementTable;
