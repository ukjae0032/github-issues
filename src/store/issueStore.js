import createStore from ".";
import { ISSUE_STATUS } from "../constant";
import { fetchBody } from "../utils";

const { addChangeListener, getState, setState } = createStore({
  issues: [],
  labels: [],
  selectedStatus: ISSUE_STATUS.OPEN,
});

const initState = async () => {
  const [issues, labels] = await Promise.all([
    fetchBody("/data-sources/issues.json"),
    fetchBody("/data-sources/labels.json"),
  ]);
  setState({
    ...getState(),
    issues,
    labels,
  });
};

initState();

const selectIssues = (state) => state.issues;

const selectOpenIssues = (state) =>
  selectIssues(state).filter((issue) => issue.status === ISSUE_STATUS.OPEN);

const selectCloseIssues = (state) =>
  selectIssues(state).filter((issue) => issue.status === ISSUE_STATUS.CLOSE);

const selectCurrentIssues = (state) =>
  selectIssues(state).filter(
    (issue) => issue.status === selectSelectedStatus(state)
  );

const selectSelectedStatus = (state) => state.selectedStatus;

export default {
  addChangeListener,
  selectOpenIssues,
  selectCloseIssues,
  selectCurrentIssues,
  selectSelectedStatus,
  getState,
  setState,
};
