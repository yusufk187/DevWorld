# README.md for the Westworld Programming Challenge Starter Kit

---

## 📦 What's Inside the Starter Kit?

Your Starter Kit has been meticulously crafted to provide you with the necessary materials to kickstart your project. Here's what you'll find:

### Directories and Files

- 📁 **`data/`**: This folder contains essential datasets:

  - 📄 `incident_reports.json`: A year's worth of incident reports to be used for data analysis.
  - 📄 `visitor_data.json`: Information about visitor activities in the park.
  - 📄 `points_of_interest.json`: Information about the main points of interest within Westworld.

- 📁 **`scripts/`**:

  - 📄 `generate_tiles.py`: A Python script to generate tiles for use with mapping libraries like Leaflet.js.

- 📁 **`tiles/`**: Contains pre-generated image tiles that can be used in your web-based applications for mapping functionalities.

- 📁 **`images/`**:

  - 🖼️ `map.png`: A map of Westworld.
  - 🖼️ `map_border.jpg`: The border map of Westworld Island.

- 📄 **`map.ipynb`**: A Jupyter Notebook with Python code examples on how to work with maps and coordinates.

- 📄 **`index.html`**: An example HTML file that shows how to use Leaflet.js in combination with `points_of_interest.json` to create an interactive map.

- 📄 **`requirements.txt`**: A list of Python packages that are required for setting up your development environment.

---

## 💡 How to Get Started?

### Prerequisites

- Python 3.x
- Jupyter Notebook
- Basic understanding of HTML, CSS, and JavaScript

### Installation Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/j-shelfwood/deep-dive-westworld-starter-kit.git
   ```

2. **Navigate to the Project Directory**

   ```bash
   cd deep-dive-westworld-starter-kit
   ```

3. **Install Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Open Jupyter Notebook**
   ```bash
   jupyter notebook
   ```

---

## 📈 The Data Analysis Challenge

Your task is to analyze a year’s worth of Westworld’s incident reports to identify patterns and hotspots. This will inform plans for building efficient tunnels for our maintenance crews.

- **Dataset**: Use `data/incident_reports.json`, `data/points_of_interest.json` and `data/visitor_data.json` for your analysis.
- **Code Samples**: Refer to the `map.ipynb` notebook for code samples on working with coordinates and map data.

#### Read more: [The Data Analysis Challenge Brief](https://www.notion.so/The-Data-Analysis-Challenge-Brief-6c1dd79387734fe2b31f4e4a9a2b9719?pvs=21)

---

## 💻 The Web Development Challenge

Your mission is to build a web-based application that will help our hovercraft crews manage incidents in real-time.

- **Base Template**: Use the `index.html` file as your starting point.
- **Mapping**: Utilize the tiles in the `tiles/` folder and Leaflet.js for mapping functionalities.

#### Read more: [The Web Development Challenge Brief](https://www.notion.so/The-Web-Development-Challenge-Brief-278827ad5e84424e9bc2f0e74bddd573?pvs=21)

---

## 📝 Notes

- For any additional questions or clarifications, feel free to reach out to the mentors.
- All datasets are fictional and are created solely for this challenge.

---

## 🚀 Let's build a better Westworld, together!

Best of luck, future architects of Westworld!

![Incident reports are handled by helicopter crews](https://prod-files-secure.s3.us-west-2.amazonaws.com/cced9481-0dd5-4ae2-a936-0d6c84f0333d/3ae33252-9be3-480d-ac38-ebb10dd28d3a/delos_helicopter.jpg)

---

_This README.md is brought to you by the Westworld Operations Team._
