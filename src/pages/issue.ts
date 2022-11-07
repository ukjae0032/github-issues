import { getIssueTpl, getIssueItemTpl } from '~/tpl.js';
import { getIssues } from '~/store/action';
import type { Issue, Status } from '~/types/issue';

const renderIssueList = (issues: Issue[]): void => {
  const issuesTemplate = issues.reduce((template, issue) => {
    return `${template}${getIssueItemTpl(issue)}`;
  }, '');

  const $issueListParent = document.querySelector('.issue-list > ul');
  if ($issueListParent != null) {
    $issueListParent.innerHTML = issuesTemplate;
  }
};

const countIssueStatus = ({ issues, status }: { issues: Issue[], status: Status }): number => {
  return issues
    .filter((issue) => issue.status === status)
    .length;
};

const renderIssueStatusCount = ({ openCount, closeCount }: { openCount: number, closeCount: number }): void => {
  const $openCount = document.querySelector('.open-count');
  const $closeCount = document.querySelector('.close-count');

  if ($openCount != null) {
    $openCount.innerHTML = `${openCount} Opens`;
  }
  if ($closeCount != null) {
    $closeCount.innerHTML = `${closeCount} Closed`;
  }
};

const initIssueStatusEventHandler = (issues: Issue[]): void => {
  const $openCount = document.querySelector('.open-count');
  const $closeCount = document.querySelector('.close-count');

  if (($openCount == null) || ($closeCount == null)) {
    return;
  }

  $openCount.addEventListener('click', () => {
    renderIssueList(filterIssueByStatus({ issues, status: 'open' }));
  });
  $closeCount.addEventListener('click', () => {
    renderIssueList(filterIssueByStatus({ issues, status: 'close' }));
  });
};

const filterIssueByStatus = ({ issues, status }: { issues: Issue[], status: Status }): Issue[] => {
  return issues.filter((issue) => issue.status === status);
};

const main = async () => {
  const $app = document.querySelector('#app');
  if ($app != null) {
    $app.innerHTML = getIssueTpl();
  }
  const issues: Issue[] = await getIssues();
  renderIssueList(filterIssueByStatus({ issues, status: 'open' }));
  renderIssueStatusCount({
    openCount: countIssueStatus({ issues, status: 'open' }),
    closeCount: countIssueStatus({ issues, status: 'close' })
  });
  initIssueStatusEventHandler(issues);
};

main().catch((error) => { console.error(error); });
