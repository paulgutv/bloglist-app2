describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Super Root',
      username: 'root',
      password: '123456'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#loginForm')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('123456')
      cy.get('#loginButton').click()

      cy.contains('Super Root logged-in')
    })
    it('fails with wrong credentials', function() {
      cy.get('#username').type('root')
      cy.get('#password').type('wrong')
      cy.get('#loginButton').click()

      cy.get('.error')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'root', password: '123456' })
      })

      it('A blog can be created', function() {
        cy.get('#revealButton').click()
          .get('#title').type('title')
          .get('#author').type('author')
          .get('#url').type('url')
          .get('#createButton').click()

        cy.contains('title - author')
      })

      it('A blog can be liked', function() {
        cy.get('#revealButton').click()
          .createBlog({ title: 'title', author: 'author', url: 'url' })
          .get('#showButton').click()
          .get('#likeButton').click()

        cy.contains('likes 1')
      })

      it('A blog can be deleted by its owner', function() {
        cy.get('#revealButton').click()
          .createBlog({ title: 'title', author: 'author', url: 'url' })
          .get('#showButton').click()
          .get('#deleteButton').click()

        cy.get('html').should('not.contain', 'title - author')
      })

      it('A blog can not be deleted by others', function() {
        cy.get('#revealButton').click()
          .createBlog({ title: 'title', author: 'author', url: 'url' })
          .contains('logout').click()

        const user2 = {
          name: 'Super Root2',
          username: 'root2',
          password: '1234567'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user2)
          .visit('http://localhost:3000')

        cy.login({ username: 'root2', password: '1234567' })
          .contains('title - author')
          .get('#showButton').click()

        cy.get('html').should('not.contain', 'delete')
      })

      it('The list of blogs is updated in order', function() {
        cy.get('#revealButton').click()
          .createBlog({ title: 'title2', author: 'author2', url: 'url2' })
          .get('#showButton').click()

        cy.contains('title2 - author2').parent().find('#likeButton').as('theButton')
        cy.get('@theButton').click()
        cy.get('@theButton').click()

        cy.get('#revealButton').click()
          .createBlog({ title: 'title1', author: 'author1', url: 'url1' })

        cy.contains('title1 - author1').find('#showButton').as('theButton2')
        cy.get('@theButton2').click()

        cy.contains('title1 - author1').parent().find('#likeButton').as('theButton3')
        cy.get('@theButton3').click()
        cy.get('@theButton3').click()
        cy.get('@theButton3').click()

        cy.get('.blog').eq(0).should('contain', 'title1')
        cy.get('.blog').eq(1).should('contain', 'title2')
      })
    })
  })
})