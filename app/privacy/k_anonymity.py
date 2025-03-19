from ..utils.data_partitioning import create_partitions
import numpy as np

def k_anonymity_calc(partition, sensitive_column):
    """
    Computes the minimum count of values in the sensitive column for k-anonymity.

    Args:
        partition: A dataset (list of dictionaries).
        sensitive_column: The column in which the value counts are evaluated.

    Returns:
        The minimum count of values in the sensitive column.
    """
    sensitive_values = [row[sensitive_column] for row in partition]
    
    unique_values, counts = np.unique(sensitive_values, return_counts=True)
    
    return np.min(counts)

def apply_k_anonymity(specificationData, sensitive_column, privacyParameter):
    """
    Filters partitioned datasets based on k-anonymity where the minimum count of
    values in the sensitive column is greater than or equal to the privacyParameter.

    Args:
        specificationData: A set of dictionaries that contain the original data.
        sensitive_column: The column in which the value counts are evaluated.
        privacyParameter: The minimum allowed count for a value in the sensitive column.

    Returns:
        A filtered list of datasets where the minimum value count in the sensitive column
        is >= privacyParameter.
    """
    partitioned_data = create_partitions(specificationData, sensitive_column)

    filtered_data = []

    for i, partition in enumerate(partitioned_data):
        min_value_count = k_anonymity_calc(partition, sensitive_column)
        
        if min_value_count >= privacyParameter:
            filtered_data.append(partition)

    return filtered_data