import Search from './search'
import { shallow } from 'enzyme'

const ENTER_KEY = 13

describe('search', () => {
  let searchCallback, subject

  beforeEach(() => {
    searchCallback = jest.fn()
    subject = shallow(<Search callback={searchCallback} searchText='some search' />)
  })

  it('does not invoke callback when any key is pressed other than enter', () => {
    subject.find('.search-bar').simulate('keyup', { keyCode: 1 })

    expect(searchCallback).not.toHaveBeenCalled()
  })

  it('invoke callback when user initiates search by pressing enter button', () => {
    subject.find('.search-bar').simulate('keyup', { keyCode: ENTER_KEY })

    expect(searchCallback).toHaveBeenCalledWith('some search')
  })

  it('show the clear button when there is text in the search input', () => {
    expect(subject.find('.clear').hasClass('disabled')).toBeFalsy()
  })

  it('clear the text in the search box when the clear icon is clicked', () => {
    subject.find('.clear-icon').simulate('click')

    expect(subject.find('input').value).toBeFalsy()
  })

  it('hide the clear button when there is no text in the search input', () => {
    subject = shallow(<Search callback={jest.fn()} />)

    expect(subject.find('.clear').hasClass('disabled')).toBeTruthy()
  })

  it('sets the search text when new text is provided', () => {
    subject.setProps({ searchText: 'a different search' })

    expect(subject.find('.search-bar').props().value).toBe('a different search')
  })

  it('does not set the search text when new text prop does not change', () => {
    subject.find('.search-bar').simulate('change', { target: { value: 'user-entered text' }})
    subject.setProps({ searchText: 'some search' })

    expect(subject.find('.search-bar').props().value).toBe('user-entered text')
  })
})
