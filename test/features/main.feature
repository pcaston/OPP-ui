Feature: Delete my data
  In order to no longer have any of my data stored on the application
  As a registered user
  I want to be able to delete my data from the application
  
  Scenario: Successfully delete my data
    Given I am a registered user
    When I login to the application
    And I visit my settings
    When I click on "Delete my data"
    And I fill in "confirmation" with "registered_user_email@example.com"
    And I press "Delete my data"
    Then I should be logged out of the application
    And I should see "Your data has been deleted from the application"
    And there shouldn't be any data for the user "registered_user_email@example.com"