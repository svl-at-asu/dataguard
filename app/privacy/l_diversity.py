from ..utils.data_partitioning import create_partitions
import numpy as np
import pandas as pd

def l_diversity_calc(group, sensitive_column):
    """Returns the number of unique values for the sensitive column in the given group."""
    values = group[sensitive_column].tolist()
    unique_values = np.unique(values)
    return len(unique_values)


def apply_l_diversity_to_partition(partition, quasi_identifiers, sensitive_column, l):
    """
    Applies l-diversity to a single partition based on quasi-identifiers and sensitive column.

    Args:
        partition: A single partition (list of dictionaries representing the dataset).
        quasi_identifiers: A list of columns to group by for l-diversity.
        sensitive_column: The column that contains sensitive information.
        l: The minimum number of distinct values required for l-diversity.

    Returns:
        A tuple with the partition (DataFrame) and a flag indicating if it meets the l-diversity criteria.
    """

    df_partition = pd.DataFrame(partition)
    grouped_data = df_partition.groupby(sensitive_column)
    
    meets_l_diversity = True 
    filtered_groups = [] 

    for _, group_df in grouped_data:
        print("group_df:", _)
        distinct_sensitive_count = l_diversity_calc(group_df, quasi_identifiers)

        if distinct_sensitive_count < l:
            meets_l_diversity = False  
            break

        filtered_groups.append(group_df)

    if not meets_l_diversity:
        return [], False  

    combined_partition = pd.concat(filtered_groups).to_dict(orient='records')
    
    return combined_partition, True


def apply_l_diversity(specificationData, quasi_identifiers, sensitive_column, l):
    """
    Applies l-diversity to the dataset by partitioning the data and ensuring each partition
    satisfies l-diversity based on quasi-identifiers and the sensitive column.

    Args:
        specificationData: A list of dictionaries representing the dataset.
        quasi_identifiers: A list of columns to group by for l-diversity.
        sensitive_column: The column that contains sensitive information.
        l: The minimum number of distinct values required for l-diversity.

    Returns:
        A list of partitions that meet the l-diversity requirement.
    """

    partitioned_data = create_partitions(specificationData, sensitive_column)

    filtered_data = []
    for partition in partitioned_data:
        filtered_partition, meets_l_diversity = apply_l_diversity_to_partition(
            partition, quasi_identifiers, sensitive_column, l
        )
        
        if meets_l_diversity:
            filtered_data.append(filtered_partition)

    return filtered_data
