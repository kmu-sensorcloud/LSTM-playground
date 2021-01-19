# -----------------------------------------------
# |                                             |
# | Simple Linear Regression Test Using PyTorch |
# |                                             |
# -----------------------------------------------

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

# Change data type
x_train = torch.FloatTensor([[2], [140], [130], [420], [530], [290], [350], [400], [170], [200], [115]])
y_train = torch.FloatTensor([[1], [3], [2], [24], [21], [8], [12], [7], [10], [9], [11]])

W = torch.zeros(1, requires_grad=True)
b = torch.zeros(1, requires_grad=True)

# Set optimizers
# optimizer = optim.SGD([W, b], lr=0.00001)
optimizer = optim.Adam([W, b], lr=0.01)
# optimizer = optim.RMSprop([W, b], lr=0.01)

epochs = 1000

for epoch in range(epochs + 1):
    hypothesis = x_train * W + b
    # [ cost function ]
    # cost = torch.mean((hypothesis - y_train) ** 2)
    cost = torch.mean(abs(hypothesis - y_train))

    optimizer.zero_grad()
    cost.backward()
    optimizer.step()

    if epoch % 100 == 0:
        print('Epoch {}/{}, W: {:.3f}, b: {:.3f} Cost: {:.3f}'.format(
            epoch, epochs, W.item(), b.item(), cost.item()
        ))

pt1 = (min(y_train), min(y_train) * W + b)
pt2 = (max(x_train), max(x_train) * W + b)
plt.scatter(x_train, y_train)
plt.plot([pt1[0], pt2[0]], [pt1[1], pt2[1]], color='red')
plt.xlabel('x')
plt.ylabel('y')
plt.show()