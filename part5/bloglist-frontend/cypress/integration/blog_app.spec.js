describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')

    cy.request('POST', 'http://localhost:3001/api/users', {
      'password': '123',
      'username': 'root',
      'name': 'a name'
    })

    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#inputUsername').type('root')
      cy.get('#inputPassword').type('123')
      cy.get('#loginSubmit').click()

      cy.contains('a name is logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#inputUsername').type('wrong')
      cy.get('#inputPassword').type('wrong')
      cy.get('#loginSubmit').click()

      cy.get('.error').should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3001/api/login', {
        username: 'root', password: '123'
      }).then(response => {
        localStorage.setItem('loggedBlogappUser', JSON.stringify(response.body))
        cy.visit('http://localhost:3000')
      })
    })

    it('A blog can be created', function() {
      cy.contains('add blog').click()

      cy.get('#titleInput').type('title')
      cy.get('#authorInput').type('author')
      cy.get('#urlInput').type('www.url.com')
      cy.get('#blogSubmit').click()

      cy.contains('title author') //blog should appear as a row of text containing title and author with single space between
    })

    describe('When user has 1 blog', function () {

      const addBlog = (title, author, url) => {
        cy.contains('add blog').click()
        cy.get('#titleInput').type(title)
        cy.get('#authorInput').type(author)
        cy.get('#urlInput').type(url)
        cy.get('#blogSubmit').click()
      }

      beforeEach(function() {
        addBlog('title', 'author', 'www.url.com')
      })

      it('user can like the blog', function() {
        cy.contains('show').click()
        cy.contains('likes 0')
        cy.contains('like').click()
        cy.contains('likes 1')
      })

      it('user can delete own blog', function () {
        cy.contains('show').click()
        cy.contains('delete').click()
        cy.should('not.contain', 'title')
        cy.should('not.contain', 'www.url.com')
      })

      it('blogs are sorted according to likes', function () {
        addBlog('title2', 'author2', 'www.url2.com')
        addBlog('title3', 'author3', 'www.url3.com')
        cy.contains('show').click()
        cy.contains('show').click()
        cy.contains('show').click()

        cy.get('.title').contains('like').click()

        cy.get('.title2').contains('like').click()
        cy.get('.title2').contains('like').click()

        cy.get('.title3').contains('like').click()
        cy.get('.title3').contains('like').click()
        cy.get('.title3').contains('like').click()

        cy.get('.blog')
          .then((elements) => {
            expect(elements[0].childNodes[8].data).to.include('likes ')
            expect(elements[0].childNodes[9].data).to.include('3') // first the highest number of likes

            expect(elements[1].childNodes[8].data).to.include('likes ')
            expect(elements[1].childNodes[9].data).to.include('2')

            expect(elements[2].childNodes[8].data).to.include('likes ')
            expect(elements[2].childNodes[9].data).to.include('1')
          })
      })

    })
  })


})