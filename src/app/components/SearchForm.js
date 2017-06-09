class SearchFormController {
  onSubmit() {
    this.onSearch();
  }
}

export const SearchForm = {
  bindings: {
    searchParams: '<',
    onSearch: '&'
  },
  templateUrl: 'app/components/SearchForm.html',
  controller: SearchFormController
};
