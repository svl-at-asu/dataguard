from ..utils.data_partitioning import create_partitions
import pandas as pd
from scipy.stats import wasserstein_distance  # For computing Earth Mover's Distance (EMD)

def compute_distribution(data, column):
    """
    Computes the probability distribution of values in the specified column.
    
    Args:
        data: List of dictionaries representing the dataset.
        column: The column for which the distribution is computed.
    
    Returns:
        A dictionary where keys are unique values and values are their probabilities.
    """
    df = pd.DataFrame(data)
    value_counts = df[column].value_counts(normalize=True)
    return value_counts.to_dict()

def compute_t_closeness(global_distribution, partition_distribution):
    """
    Computes the Earth Mover's Distance (EMD) between the global distribution and partition distribution.
    
    Args:
        global_distribution: The global distribution of the sensitive column.
        partition_distribution: The distribution of the sensitive column in the partition.
    
    Returns:
        The Earth Mover's Distance between the two distributions.
    """
    global_keys = sorted(global_distribution.keys())
    partition_keys = sorted(partition_distribution.keys())

    global_probs = [global_distribution.get(key, 0) for key in global_keys]
    partition_probs = [partition_distribution.get(key, 0) for key in partition_keys]

    emd = wasserstein_distance(global_probs, partition_probs)
    
    return emd

def apply_t_closeness(specificationData, sensitive_column, t):
    """
    Applies t-closeness to partitioned data using Earth Mover's Distance (EMD) and filters based on t-value.
    
    Args:
        specificationData: The original dataset.
        partitioned_data: The partitioned dataset (list of partitions).
        sensitive_column: The sensitive column to analyze (e.g., 'disease').
        t_value: The maximum allowed EMD (t value) for t-closeness.
    
    Returns:
        A list of partitions that satisfy t-closeness.
    """
    partitioned_data = create_partitions(specificationData, sensitive_column)

    global_distribution = compute_distribution(specificationData, sensitive_column)
    
    filtered_data = []

    for partition in partitioned_data:
        partition_distribution = compute_distribution(partition, sensitive_column)
        
        emd = compute_t_closeness(global_distribution, partition_distribution)
        
        if emd <= t:
            filtered_data.append(partition)

    return filtered_data