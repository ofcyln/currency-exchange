import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display Login message if user is not authenticated', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Login');
  });
});
