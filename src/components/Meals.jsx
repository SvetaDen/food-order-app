import MealItem from "./MealItem.jsx";
import useHttp from "../hooks/useHttp.js";
import Error from "./Error.jsx";
import {API_BASE_URL} from "../util/config.js";


const requestConfig ={};
const Meals = () => {

    const {
        data: loadedMeals,
        isLoading,
        error
    } = useHttp(`${API_BASE_URL}/meals`, requestConfig, []);

    if (isLoading) {
        return <p className="center">Fetching meals...</p>
    }
    if(error){
        return <Error title="Failed to fetch meals" message={error}/>
    }

    return (
        <ul id="meals">
            {loadedMeals.map((meal) => (
                <MealItem key={meal.id} meal={meal}/>
            ))}
        </ul>
    );
};

export default Meals;