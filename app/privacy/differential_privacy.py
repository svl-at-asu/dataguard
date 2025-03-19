from ..utils.data_partitioning import create_partitions
import numpy as np

def apply_differential_privacy(specificationData, sensitive_column, privacyParameter):
    """
    Applies differential privacy to the given dataset based on the type of the sensitive column.

    Args:
        specificationData: The dataset to be privatized (a list of dictionaries).
        sensitive_column: The column with sensitive data.
        privacyParameter: The privacy parameter (epsilon).

    Returns:
        A dataset with differential privacy applied.
    """
    # partitioned_data = create_partitions(specificationData, sensitive_column)
    partitioned_data = [specificationData for i in range(49)]

    sensitive_column_value = specificationData[0][sensitive_column] 
 
    if isinstance(sensitive_column_value, (str, bool)):
        dp_data = exponential_mechanism(partitioned_data, sensitive_column, privacyParameter)
    elif isinstance(sensitive_column_value, (int, float)): 
        dp_data = laplace_mechanism(specificationData, partitioned_data, sensitive_column, privacyParameter)
    else:
        raise ValueError(f"Unsupported data type for differential privacy: {type(sensitive_column_value)}. Only categorical or numeric types are supported.")
    return dp_data

def exponential_mechanism(partitioned_data, sensitive_column, epsilon):
    """
    Applies the exponential mechanism for differential privacy on categorical data.

    Args:
        partitioned_data: The partitioned dataset.
        sensitive_column: The column with sensitive data.
        epsilon: The privacy parameter.

    Returns:
        A dataset with differential privacy applied using the exponential mechanism.
    """
    dp_partitioned_data = []

    for partition in partitioned_data:
        sensitive_attribute = [item[sensitive_column] for item in partition]

        unique_values, counts = np.unique(sensitive_attribute, return_counts=True)

        scores = counts / counts.sum()

        em_prob = [np.exp(epsilon * score / 2) for score in scores]

        em_prob = em_prob / np.linalg.norm(em_prob, ord=1)

        for item in partition:
            dp_dataset = [{**item, sensitive_column: np.random.choice(unique_values, 1, p=em_prob)[0]} for item in partition]

        dp_partitioned_data.append(dp_dataset)

    return dp_partitioned_data

def laplace_mechanism(specificationData, partitioned_data, sensitive_column, epsilon):
    """
    Applies the Laplace mechanism for differential privacy on numeric data.

    Args:
        partitioned_data: The partitioned dataset.
        sensitive_column: The column with sensitive data.
        epsilon: The privacy parameter.

    Returns:
        A dataset with differential privacy applied using the Laplace mechanism.
    """
    dp_partitioned_data = []

    for i, partition in enumerate(partitioned_data):
        dp_dataset = [{**item, sensitive_column: item[sensitive_column] + np.random.laplace(0, 1/epsilon, 1)[0]} for item in specificationData]
        dp_partitioned_data.append(dp_dataset)

    return dp_partitioned_data