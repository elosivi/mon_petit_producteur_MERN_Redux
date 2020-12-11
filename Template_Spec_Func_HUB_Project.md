# Introdution
The aim of this request of proposal (RFP) is to present the requirements for the **NAME_OF_PROJECT** project.

# Project context
The provider will have to **PROJECT_DEFINITION**.

# Requirement
The software must implement the following requirements and are organized in four categories:

* REQ_DESIGN_XXX: design requirements
* REQ_FUNC_XXX: functional requirements
* REQ_IHM_XXX: IHM requirements
* REQ_DATA_XXX: data managing requirements

## Design requirements
|Requirement ID|Descriptions|
|---:|:---|
|**REQ_DESIGN_001**|Use of the MERN Stack (for the web part)|
|**REQ_DESIGN_002**|Use of REACT-NATIVE (for the mobile part: optional). We would like to privilege development on Android. The deployment on iOS is too complex in terms of authorizations.|
|**REQ_DESIGN_003**|Dissociation of the project in two parts: client side and server side (in order to use a common base for web and mobile)|
|**REQ_DESIGN_004**|Using the google Map Plateform API|
|**REQ_DESIGN_005**|Authentication system with Google (at least for consumer consultation) + usual login system|


## Functional requirements
|Requirement ID|Descriptions|
|---:|:---|
|**REQ_FUNC_001**|Login / Logout with own API and Google API, as producer or consumer|
|Test | access or not to own profile |
|**REQ_FUNC_002**|As Consumer : Register with a form |
|Test | login ok after registration |
|**REQ_FUNC_003**|As Producer : fill a form, sended to administrators, to request registration and be refenced on the website|
|Test | form received and answer sended |
|**REQ_FUNC_004**|As Producer : fill his/her profile to present his/her production (contact information, adress, where products are availables, about him/her...)|
|Test | access to this profil by all type of users|
|**REQ_FUNC_005**|As Producer : post his/her products and prices according to products availables + category in the post (like a social network)|
|Test | access to this presentation by all type of users|
|**REQ_FUNC_006**|As Consumer logged : Access to his/her profile with favorites producers / products|
|Test| access to own profil  |
|**REQ_FUNC_007**|As Consumer logged : Find a producer according to the type of products and/or localisation|
|Test| search -> results sorted |
|**REQ_FUNC_008**|As Consumer logged : Add favorites producers/products in a personnal list|
|Test| favorites appears in profile |
|**REQ_FUNC_009**|As Consumer logged : Note producers (note 0->5, only the average grade is visible) and like products (number of like visible) |
|Test|  |
|**REQ_FUNC_010**|As Producer : post virtual visit about his/her "farm", via Youtube|
|Test| appear on his/her profil|
|**REQ_FUNC_011**|As Consumer logged :contact the producer by email / tel|
|Test|  |
|**REQ_FUNC_012**|As Consumer logged : reservation of products on line: producer inform about quantity available (in kg or quantity), when a consumer reserve the stock available decreases until the stock will be null, the consumer can ask to be informed if stock changes|
|Test|  |
|**REQ_FUNC_013**|As Consumer logged : choose favorites products (by category), when a producer sends a post concerning this product with the good category consumer receive a notification|
|Test |  |
|**REQ_FUNC_014**|As Consumer logged : received a notification when his/her favorite producer sends a new post |
|Test|  |

## IHM requirements
|Requirement ID|Descriptions|
|---:|:---|
|**REQ_IHM_001**|A map with all producers and products|
|**REQ_IHM_002**|Product filter for the map|
|**REQ_IHM_003**|quantity(in kg or quantity) for each prodcuts, this stock decrease when a consumer books for a product|
|**REQ_IHM_004**|reserve notification systeme for the consumer|
|TESTS| product filter need to show the right thing on the map * map need to show with "picots" all producers on the map * check if the stock decrease correctly when a consumer reserve and check if the quantity is display for each products * check if the consumer receive the notification |


## Data requirements
|Requirement ID|Descriptions|
|---:|:---|
|**REQ_DATA_001**|For people->collection "users" (id, firstname, lastname, email, encrypted passwords, adress, telephone, category [admin, producer, consumer], subscriptions to producers / products, whatIlike)|
|**REQ_DATA_002**|For farms->collection "farms" (id, name, owner, adress [country, region, city, street], GPS coordinates [latitude longitude], products, product categories)|
|**REQ_DATA_003**|collection "articles" (id, farm_id, title, content/description, pictures, videos)|
|**REQ_DATA_004**|For products : collection "products" (id, farm_id, name, category, unitSize, stock, availability, origin, season, description, price)|


# Delivery conditions
## Documentation:
The delivery package must contain the following documents:<br/>
* _README.md_ witch is the first delivery of projet to defined context
* Code and it's documentation using doxygen format.
* _Template_Spec_Func_HUB_Project.md_ fill with all details about requirement and functionnalities.
* _Software_Architecture_Specifications.md_ fill with **HOW** the projects works (for each parts). (Tech3 only)


# Planning
The planning of the project consists of several deadlines, T0 is the bebinning of the project:

|**Object**|**Week**|
|---:|:---|
|**Kick-off**      |T0|
|**Bootstrap**     |T0|
|**Follow up**     |T0 + 2 weeks|
|**Follow up**     |T0 + 4 weeks|
|**Delivery**      |T0 + 4 weeks|
|**Review** 	   |T0 + 5 weeks|
